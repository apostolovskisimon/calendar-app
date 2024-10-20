import useBiometrics from '@/hooks/useBiometrics';
import {
  SAVED_BIOMETRICS_KEY,
  SAVED_USER_LOGGED_EMAIL,
  USER_DATA,
} from '@/services/constants';
import {signInWithEmail} from '@/services/firebase';
import {LoginData} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {showToast} from '@/helpers/toast';
import {Button, Overlay, Text, useTheme} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {Theme} from '@rneui/base';

type AuthState = {
  isLoggedIn: boolean;
  seisLoggedIn: Dispatch<SetStateAction<boolean>>;
  tryLogInUser: (callback?: (val: boolean) => void) => Promise<void>;
  logUserIn: (loginData: LoginData) => Promise<void>;
};

const initialState: AuthState = {
  isLoggedIn: false,
  seisLoggedIn: () => {},
  tryLogInUser: async () => {},
  logUserIn: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [isLoggedIn, seisLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [showBiometricsConfirmModal, setShowBiometricsConfirmModal] =
    useState(false);

  const {getCredentialsWithBiometry, saveCredentials} = useBiometrics();

  const tryLogInUser = useCallback(
    async (setLoader?: (val: boolean) => void) => {
      try {
        const localSavedEmail = await AsyncStorage.getItem(
          SAVED_USER_LOGGED_EMAIL,
        );

        const keyChainEmail = await getCredentialsWithBiometry();

        console.log('keyChainEmail', keyChainEmail);
        console.log('localSavedEmail', localSavedEmail);

        if (keyChainEmail && localSavedEmail) {
          // match the username(email) of the keychain with the locally saved email
          const isMatchingEmails = keyChainEmail.username == localSavedEmail;
          if (isMatchingEmails) {
            console.log('can login');
          }
        }

        setLoader && setLoader(false);
        // do replace with private stack
      } catch (error) {}
    },
    [getCredentialsWithBiometry],
  );

  const login = useCallback(async () => {
    if (loginData) {
      try {
        const userData = await signInWithEmail(
          loginData.email,
          loginData.password,
        );

        if (userData && userData.user) {
          await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData.user));
          setLoginData(null); // cleanup
          setUser(userData.user);
        }
      } catch (error: any) {
        showToast('Error', 'error', error.userInfo?.message);
      }
    }
  }, [loginData]);

  const userContinuesWithoutBiometrics = useCallback(async () => {
    login();
  }, [login]);

  // TODO: Check auth flow, 1st sign in to firebase, then if credentials ok, open modal to confirm biometrics, if accept, show biometrics, else continue
  // TODO: after this, on next open immediatly show biometrics with silent auto login (if using biometrics, else manual login (no ask modal biometrics))

  const logUserIn = useCallback(
    async ({email, password}: LoginData) => {
      try {
        setLoginData({email, password});
        const acceptedBiometricsBefore = await AsyncStorage.getItem(
          SAVED_BIOMETRICS_KEY,
        );
        if (!acceptedBiometricsBefore) {
          setShowBiometricsConfirmModal(true);
        } else {
          userContinuesWithoutBiometrics();
        }
      } catch (error: any) {
        showToast('Error', 'error', 'Something went wrong.');
      }
    },
    [userContinuesWithoutBiometrics],
  );

  const userAcceptsBiometrics = useCallback(async () => {
    if (loginData) {
      const isUsingBiometrics = await saveCredentials(
        loginData.email,
        loginData.password,
      );

      if (isUsingBiometrics) {
        // do actual log in
        login();
      }
    }
  }, [login, loginData, saveCredentials]);

  const onAuthStateChanged = useCallback(
    (userData: FirebaseAuthTypes.User | null) => {
      console.log('logged in', userData);
      setUser(userData);
    },
    [],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  const {theme} = useTheme();
  const styles = createStyles(theme);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        seisLoggedIn,
        tryLogInUser,
        logUserIn,
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
            <Button buttonStyle={styles.buttonContinue}>
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
