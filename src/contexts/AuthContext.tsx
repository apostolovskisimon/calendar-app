import {showToast} from '@/helpers/toast';
import useBiometrics from '@/hooks/useBiometrics';
import {IS_USING_BIOMETRICS, USER_DATA} from '@/services/constants';
import {
  logOutUser,
  signInWithEmail,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
} from '@/services/firebase';
import {LoginData, User} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  user: User;
  submitCredentials: (loginData: LoginData) => Promise<void>;
  askForBiometrics: (
    callback: Dispatch<SetStateAction<boolean>>,
  ) => Promise<void>;
  isLoading: boolean;
  updateProfile: (
    email: string,
    displayName: string,
  ) => Promise<boolean | undefined>;
  changePassword: (password: string) => Promise<boolean | undefined>;
  handleLogout: () => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  submitCredentials: async () => {},
  askForBiometrics: async () => {},
  isLoading: false,
  updateProfile: async () => false,
  changePassword: async () => false,
  handleLogout: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

/**
 *  USER IS ONLY SET AFTER SUBMITTING BIOMETRICS OR MANUAL LOGIN
 */

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricsConfirmModal, setShowBiometricsConfirmModal] =
    useState(false);

  const {
    getCredentialsWithBiometry,
    saveCredentials,
    saveCredentialsWithBiometry,
  } = useBiometrics();

  /**
   * Firebase can limit how many times you can login per day,
   * as a workarount, once the user logs in his firebase accaunt data is saved in asynstorage
   * then on each app start we ask for biometrics that compare
   */
  const loginToFirebase = useCallback(
    async (email: string | undefined, password: string | undefined) => {
      if (email && password) {
        if (!isLoading) setIsLoading(true);
        try {
          const userData = await signInWithEmail(email, password);
          await AsyncStorage.setItem(USER_DATA, JSON.stringify(userData.user));
          setUser(userData.user);

          return Promise.resolve(userData.user);
        } catch (error: any) {
          showToast('Error', 'error', error.userInfo?.message);
          return Promise.reject(error.userInfo?.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        showToast('Error', 'error', 'No credentials.');
      }
    },
    [isLoading],
  );

  const askForBiometrics = useCallback(
    async (loader?: Dispatch<SetStateAction<boolean>>) => {
      if (user) {
        return;
      }

      try {
        setIsLoading(true);
        const credentials = await getCredentialsWithBiometry();
        if (credentials) {
          const {password, username: email} = credentials;
          const savedData = await AsyncStorage.getItem(USER_DATA);
          const savedUserData = savedData ? JSON.parse(savedData) : null;
          if (savedUserData && savedUserData.email) {
            // user is already logged in so we just set it to get in the private screens
            setUser(savedUserData);
            return;
          }
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
        setIsLoading(false);
      }
    },
    [getCredentialsWithBiometry, loginToFirebase, user],
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

  const submitCredentials = useCallback(
    async ({email, password}: LoginData) => {
      try {
        setLoginData({email, password});

        const isUsingBiometrics = await AsyncStorage.getItem(
          IS_USING_BIOMETRICS,
        );

        // if user doesnt use biometrics then manual login
        if (isUsingBiometrics === 'false') {
          return userContinuesWithoutBiometrics();
        }

        // the 'boolean' isnt set which means its a first login
        // show modal for biometrics
        if (isUsingBiometrics == null) {
          return setShowBiometricsConfirmModal(true);
        }
        loginToFirebase(email, password);
      } catch (error: any) {
        showToast('Error', 'error', 'Something went wrong.');
      }
    },
    [loginToFirebase, userContinuesWithoutBiometrics],
  );

  const updateProfile = useCallback(
    async (email: string, displayName: string) => {
      try {
        setIsLoading(true);
        const credentials = await getCredentialsWithBiometry(
          'Confirm it is you.',
        );
        if (credentials) {
          const {password: savedPassword, username: savedEmail} = credentials;
          // silent reauthenticate to refresh token
          const rellogedUser = await loginToFirebase(savedEmail, savedPassword);

          if (rellogedUser) {
            await Promise.all([
              updateUserEmail(email),
              updateUserProfile(displayName),
            ]);
            // if success (both return void)
            const updatedUser = {...rellogedUser, email, displayName};
            setUser(updatedUser);
            await AsyncStorage.setItem(USER_DATA, JSON.stringify(updatedUser));
            // update keychain with new email
            await saveCredentialsWithBiometry(email, savedPassword, true);
            showToast('Success', 'success', 'Your profile has been updated.');
            return Promise.resolve(true);
          }
        }

        // both functions return void so, we assume it updated succeess
      } catch (error: any) {
        showToast('Error', 'error', 'Updating failed. Try again');
        return Promise.resolve(false);
      } finally {
        setIsLoading(false);
      }
    },
    [getCredentialsWithBiometry, loginToFirebase, saveCredentialsWithBiometry],
  );

  const changePassword = useCallback(
    async (password: string) => {
      try {
        const credentials = await getCredentialsWithBiometry(
          'Confirm it is you.',
        );
        if (credentials) {
          const {password: savedPassword, username: savedEmail} = credentials;
          // firebase requires login again before submit for change sensitive info
          const rellogedUser = await loginToFirebase(savedEmail, savedPassword);

          // if success, returns void
          await updateUserPassword(password);
          // update keychain with new password
          await saveCredentialsWithBiometry(
            rellogedUser?.email!,
            password,
            true,
          );
          showToast('Success', 'success', 'Your Password has been updated.');
          return Promise.resolve(true);
        }
      } catch (error) {
        console.log('error', error);
        showToast('Error', 'error', 'Updating failed. Try again');
        return Promise.resolve(false);
      }
    },
    [getCredentialsWithBiometry, loginToFirebase, saveCredentialsWithBiometry],
  );

  const handleLogout = useCallback(async () => {
    await logOutUser();
    await AsyncStorage.removeItem(USER_DATA);
    setUser(null);
  }, []);

  useEffect(() => {
    const getBiometricsIfSaved = async () => {
      const isUsingBiometrics = await AsyncStorage.getItem(IS_USING_BIOMETRICS);
      if (isUsingBiometrics === 'true') {
        askForBiometrics();
      }
    };
    getBiometricsIfSaved();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {theme} = useTheme();
  const styles = createStyles(theme);
  return (
    <AuthContext.Provider
      value={{
        user,
        submitCredentials,
        askForBiometrics,
        isLoading,
        updateProfile,
        changePassword,
        handleLogout,
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
