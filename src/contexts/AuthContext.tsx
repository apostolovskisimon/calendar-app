import {showToast} from '@/helpers/toast';
import useBiometrics from '@/hooks/useBiometrics';
import {IS_USING_BIOMETRICS, USER_DATA} from '@/services/constants';
import {signInWithEmail} from '@/services/firebase';
import {LoginData} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Theme} from '@rneui/base';
import {Button, Overlay, Text, useTheme} from '@rneui/themed';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';

type AuthState = {
  user: FirebaseAuthTypes.User | null;
  submitCredentials: (loginData: LoginData) => Promise<void>;
  askForBiometrics: (
    callback: Dispatch<SetStateAction<boolean>>,
  ) => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  submitCredentials: async () => {},
  askForBiometrics: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [showBiometricsConfirmModal, setShowBiometricsConfirmModal] =
    useState(false);

  const {getCredentialsWithBiometry, saveCredentials} = useBiometrics();

  const loginToFirebase = useCallback(
    async (email: string | undefined, password: string | undefined) => {
      if (email && password) {
        try {
          const userData = await signInWithEmail(email, password);

          if (userData && userData.user) {
            await AsyncStorage.setItem(
              USER_DATA,
              JSON.stringify(userData.user),
            );
            setUser(userData.user);
            // returns for landing screen callback
            return Promise.resolve(userData.user);

            // navigate to public stack
          }
        } catch (error: any) {
          showToast('Error', 'error', error.userInfo?.message);
          return Promise.reject(error.userInfo?.message);
        }
      } else {
        showToast('Error', 'error', 'No credentials.');
      }
    },
    [],
  );

  const askForBiometrics = useCallback(
    async (loader?: Dispatch<SetStateAction<boolean>>) => {
      try {
        const credentials = await getCredentialsWithBiometry();
        if (credentials) {
          const {password, username: email} = credentials;
          // use keychain credentials to log in
          await loginToFirebase(email, password);
        } else {
          showToast(
            'Error',
            'error',
            'Error fetching credentials. Please try again.',
          );
        }
      } catch (error: any) {
        showToast('Error', 'error', error);
      } finally {
        loader && loader(false);
      }
    },
    [getCredentialsWithBiometry, loginToFirebase],
  );

  const userAcceptsBiometrics = useCallback(async () => {
    if (loginData) {
      // save login data to keychain
      const isUsingBiometrics = await saveCredentials(
        loginData.email,
        loginData.password,
      );

      if (isUsingBiometrics) {
        askForBiometrics();
        setLoginData(null);
      }
    }
  }, [askForBiometrics, loginData, saveCredentials]);

  const userContinuesWithoutBiometrics = useCallback(async () => {
    await AsyncStorage.setItem(IS_USING_BIOMETRICS, 'false');
    loginToFirebase(loginData?.email, loginData?.password);
  }, [loginData?.email, loginData?.password, loginToFirebase]);

  // TODO: Check auth flow, 1st sign in to firebase, then if credentials ok, open modal to confirm biometrics, if accept, show biometrics, else continue
  // TODO: after this, on next open immediatly show biometrics with silent auto login (if using biometrics, else manual login (no ask modal biometrics))

  const submitCredentials = useCallback(
    async ({email, password}: LoginData) => {
      try {
        setLoginData({email, password});

        const isUsingBiometrics = await AsyncStorage.getItem(
          IS_USING_BIOMETRICS,
        );

        // if user has previously selected to use biometrics,
        // but cancelled

        if (isUsingBiometrics === 'true') {
          askForBiometrics();
          return;
        }

        // if user doesnt use biometrics then manual login
        if (isUsingBiometrics === 'false') {
          return userContinuesWithoutBiometrics();
        }

        // the 'boolean' isnt set which means its a first login
        // show modal for biometrics
        if (isUsingBiometrics == null) {
          return setShowBiometricsConfirmModal(true);
        }
      } catch (error: any) {
        showToast('Error', 'error', 'Something went wrong.');
      }
    },
    [askForBiometrics, userContinuesWithoutBiometrics],
  );

  const onAuthStateChanged = useCallback(
    (userData: FirebaseAuthTypes.User | null) => {
      setUser(userData);
    },
    [],
  );

  useEffect(() => {
    const getBiometricsIfSaved = async () => {
      const isUsingBiometrics = await AsyncStorage.getItem(IS_USING_BIOMETRICS);
      if (isUsingBiometrics === 'true') {
        askForBiometrics();
      }
    };
    getBiometricsIfSaved();
  }, [askForBiometrics]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  const {theme} = useTheme();
  const styles = createStyles(theme);
  return (
    <AuthContext.Provider
      value={{
        user,
        submitCredentials,
        askForBiometrics,
      }}>
      {showBiometricsConfirmModal && (
        <Overlay
          isVisible
          overlayStyle={styles.overlay}
          onBackdropPress={() => setShowBiometricsConfirmModal(false)}>
          <Text style={styles.title}>
            Do you wish to enable biometrics to replace credentials log in?
          </Text>
          <Text style={styles.subtitle}>
            For better security it is better to use biometrics.
          </Text>
          <View>
            <Button
              buttonStyle={styles.buttonConfirm}
              onPress={userAcceptsBiometrics}>
              Accept
            </Button>
            <Button
              buttonStyle={styles.buttonContinue}
              onPress={userContinuesWithoutBiometrics}>
              Continue without Biometrics
            </Button>
          </View>
        </Overlay>
      )}
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Auth context not avaialble.');

  return context;
};

export {AuthContextProvider, useAuth};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      padding: 20,
    },
    title: {
      textAlign: 'center',
      fontSize: 20,
      marginBottom: 15,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 15,
    },
    buttonConfirm: {
      backgroundColor: theme.colors.success,
      alignSelf: 'center',
      marginBottom: 10,
    },
    buttonContinue: {
      backgroundColor: theme.colors.warning,
      alignSelf: 'center',
      marginBottom: 10,
    },
  });
