import RegisterForm from '@/components/RegisterForm';
import {Theme} from '@rneui/base';
import {Text, useTheme} from '@rneui/themed';
import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {};

const RegisterScreen = (props: Props) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <KeyboardAwareScrollView style={styles.page}>
      <Text style={styles.welcome}>
        Enter your details in order to create an account.
      </Text>
      <RegisterForm />
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    welcome: {
      marginTop: 20,
    },
    welcomeBold: {
      color: theme.colors.primary,
      fontWeight: 700,
      textDecorationLine: 'underline',
    },
    continue: {
      fontSize: 16,
      marginTop: 20,
    },
    registerButton: {
      marginTop: 20,
    },
    registerButtonText: {
      color: theme.colors.warning,
    },
    registerTapHere: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      color: theme.colors.warning,
    },
  });
