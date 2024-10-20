import useBiometrics from '@/hooks/useBiometrics';
import {PublicScreenProps} from '@/services/types';
import {Theme} from '@rneui/base';
import {Button, Text, useTheme} from '@rneui/themed';
import React, {FC, useCallback, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';

type ParamsType = {
  email: string;
};

const CompleteRegistration: FC<PublicScreenProps> = ({
  route: {params},
  navigation,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {email} = params as ParamsType;

  const {saveCredentials} = useBiometrics();

  const handleSaveCredentials = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const isSaved = await saveCredentials(email);
      if (isSaved) {
        navigation.replace('Welcome');
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }, [email, navigation, saveCredentials]);

  return (
    <ScrollView style={styles.page}>
      <Text style={styles.withMarginBottom}>
        Because your device supports biometrics, you also need to save this
        information.
      </Text>
      <Text style={styles.withMarginBottom}>
        A prompt will appear to confirm biometrics on every opening of the app
        to ensure proper security and that it is you who is accessing it.
      </Text>

      <Text>
        Your account has been created and saved. If you don't add biometrics
        now, every time you open the app you will be prompted to save before
        having access to the whole application.
      </Text>

      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        containerStyle={styles.button}
        onPress={handleSaveCredentials}>
        <Text style={styles.buttonText}>Save Biometrics</Text>
      </Button>
    </ScrollView>
  );
};

export default CompleteRegistration;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    button: {
      alignSelf: 'center',
      marginTop: 30,
    },
    buttonText: {
      color: 'white',
      padding: 6,
      fontWeight: 700,
      fontSize: 20,
    },
    withMarginBottom: {
      marginBottom: 12,
    },
  });
