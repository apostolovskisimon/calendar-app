import {showToast} from '@/helpers/toast';
import {IS_USING_BIOMETRICS} from '@/services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import * as Keychain from 'react-native-keychain';

const useBiometrics = () => {
  const getSupportedBiometrics = useCallback(async () => {
    try {
      const biometryType = await Keychain.getSupportedBiometryType();
      return !!biometryType;
    } catch (error) {
      return false;
    }
  }, []);

  const saveCredentialsWithBiometry = useCallback(
    async (email: string, password: string, isUpdate: boolean = false) => {
      try {
        await Keychain.setGenericPassword(email, password, {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
        !isUpdate &&
          showToast('Success', 'success', 'You are using biometrics.');
        await AsyncStorage.setItem(IS_USING_BIOMETRICS, 'true');
        return Promise.resolve(true);
      } catch (error: any) {
        showToast('Error saving credentials.', 'error', error?.message);
        if (error.name === 'BiometryEnrollmentCancel') {
          showToast('Cancelled', 'error', 'Biometrics cancelled');
        } else {
          showToast('Error', 'error', 'An error occured. Try again.');
        }
        return Promise.resolve(false);
      }
    },
    [],
  );
  // Function to retrieve credentials with biometric authentication
  const getCredentialsWithBiometry = useCallback(
    async (title: string = 'Scan biometrics to log in.') => {
      try {
        const credentials = await Keychain.getGenericPassword({
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          authenticationPrompt: {
            title,
          },
        });
        return credentials;
      } catch (error: any) {
        showToast('Error', 'error', error.message);
        if (error.message.includes('authentication failed')) {
          showToast('Failed', 'error', error.message);
        } else {
          showToast('Error', 'error', 'An error occured. Try again.');
        }
        return null;
      }
    },
    [],
  );

  const saveCredentials = useCallback(
    async (email: string, password: string) => {
      // const biometrySupported = await getSupportedBiometrics();

      // TODO: Check for support?
      // if (biometrySupported) {
      // TODO: Would be a good idea to hash/encrypt the keychain saved password
      return await saveCredentialsWithBiometry(email, password);
      // }
    },
    [saveCredentialsWithBiometry],
  );
  return {
    saveCredentials,
    getCredentialsWithBiometry,
    getSupportedBiometrics,
    saveCredentialsWithBiometry,
  };
};

export default useBiometrics;
