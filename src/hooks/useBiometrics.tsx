import uuid from 'react-native-uuid';
import * as Keychain from 'react-native-keychain';
import {useCallback} from 'react';
import {showToast} from '@/helpers/toast';
import {useAuth} from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SAVED_BIOMETRICS_KEY} from '@/services/constants';

const useBiometrics = () => {
  const {setHasBiometricsSaved} = useAuth();
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
        showToast(
          'Success.',
          'success',
          'Biometrics successfully stored. You can log in now.',
        );
        await AsyncStorage.setItem(SAVED_BIOMETRICS_KEY, 'true');
        setHasBiometricsSaved(true);
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
    [setHasBiometricsSaved],
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

  // Example usage
  const saveCredentials = useCallback(
    async (email: string) => {
      const biometrySupported = await getSupportedBiometrics();

      if (biometrySupported) {
        const pwHash = uuid.v4().toString();
        // Save credentials with biometric protection
        return await saveCredentialsWithBiometry(email, pwHash);
      }
    },
    [getSupportedBiometrics, saveCredentialsWithBiometry],
  );
  return {saveCredentials, getCredentialsWithBiometry, getSupportedBiometrics};
};

export default useBiometrics;
