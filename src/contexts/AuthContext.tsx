import {showToast} from '@/helpers/toast';
import useBiometrics from '@/hooks/useBiometrics';
import {
  SAVED_BIOMETRICS_KEY,
  SAVED_USER_LOGGED_EMAIL,
} from '@/services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthState = {
  isLoggedIn: boolean;
  seisLoggedIn: Dispatch<SetStateAction<boolean>>;
  canSaveBiometrics: boolean;
  hasBiometricsSaved: boolean;
  setHasBiometricsSaved: Dispatch<SetStateAction<boolean>>;
  tryLogInUser: (callback?: (val: boolean) => void) => Promise<void>;
};

const initialState: AuthState = {
  isLoggedIn: false,
  seisLoggedIn: () => {},
  canSaveBiometrics: false,
  hasBiometricsSaved: false,
  setHasBiometricsSaved: () => {},
  tryLogInUser: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [isLoggedIn, seisLoggedIn] = useState(false);

  const [canSaveBiometrics, setCanSaveBiometrics] = useState(false);
  const [hasBiometricsSaved, setHasBiometricsSaved] = useState(false);

  const {getSupportedBiometrics, getCredentialsWithBiometry} = useBiometrics();

  const hasSupportedBiometrics = useCallback(async () => {
    const hasSupport = await getSupportedBiometrics();
    setCanSaveBiometrics(hasSupport);
  }, [getSupportedBiometrics]);

  const hasSavedBiometrics = useCallback(async () => {
    const saved = await AsyncStorage.getItem(SAVED_BIOMETRICS_KEY);
    if (!!saved && saved === 'true') {
      setHasBiometricsSaved(true);
    }
  }, []);

  const tryLogInUser = useCallback(
    async (setLoader?: (val: boolean) => void) => {
      if (canSaveBiometrics) {
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
      } else {
        setLoader && setLoader(false);
        showToast('Error', 'error', "Can't log in.");
      }
    },
    [canSaveBiometrics, getCredentialsWithBiometry],
  );

  // if user has biometrics support on device, then we will prompt him on every open of app and on registration as confirmation
  // if not then he will be prompted to log in each time
  useEffect(() => {
    hasSupportedBiometrics();
    hasSavedBiometrics();
  }, [hasSavedBiometrics, hasSupportedBiometrics]);

  useEffect(() => {
    if (hasBiometricsSaved) {
      tryLogInUser();
    }
  }, [hasBiometricsSaved, hasSavedBiometrics, tryLogInUser]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        seisLoggedIn,
        canSaveBiometrics,
        hasBiometricsSaved,
        setHasBiometricsSaved,
        tryLogInUser,
      }}>
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
