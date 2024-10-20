import {showToast} from '@/helpers/toast';
import {SAVED_BIOMETRICS_KEY} from '@/services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import * as Keychain from 'react-native-keychain';
import uuid from 'react-native-uuid';

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
    async (email: string, password: string) => {
      try {
        await Keychain.setGenericPassword(email, password, {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
        showToast('Success', 'success', 'You are using biometrics.');
        await AsyncStorage.setItem(SAVED_BIOMETRICS_KEY, 'true');
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
  const getCredentialsWithBiometry = useCallback(async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        authenticationPrompt: {
          title: 'Scan biometrics to log in.',
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
  }, []);

  const saveCredentials = useCallback(
    async (email: string, password: string) => {
      const biometrySupported = await getSupportedBiometrics();

      // TODO: Check for support?
      // if (biometrySupported) {
      // TODO: Would be a good idea to hash/encrypt the keychain saved password
      return await saveCredentialsWithBiometry(email, password);
      // }
    },
    [getSupportedBiometrics, saveCredentialsWithBiometry],
  );
  return {saveCredentials, getCredentialsWithBiometry, getSupportedBiometrics};
};

export default useBiometrics;
