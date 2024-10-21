import LoginForm from '@/components/LoginForm';
import {useAuth} from '@/contexts/AuthContext';
import {PublicScreenProps} from '@/services/types';
import {Text, Theme} from '@rneui/base';
import {useTheme} from '@rneui/themed';
import React, {FC, useCallback, useState} from 'react';
import {Pressable, RefreshControl, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const LandingScreen: FC<PublicScreenProps> = ({navigation}) => {
  const {askForBiometrics} = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const {theme} = useTheme();
  const styles = createStyles(theme);

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    askForBiometrics(setRefreshing);
  }, [askForBiometrics]);

  return (
    <KeyboardAwareScrollView
      style={styles.page}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.welcome}>
        <Text style={styles.welcomeBold}>THE</Text> Calendar App
      </Text>
      <Text style={styles.continue}>
        Before you can view your calendar and set events, you must create an
        account or log in.
      </Text>
      <LoginForm />

      <Pressable style={styles.registerButton} onPress={goToRegister}>
        <Text style={styles.registerButtonText}>
          Don't have an account? Tap{' '}
          <Text style={styles.registerTapHere}>here</Text> to open the
          registration form.
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default LandingScreen;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    welcome: {
      marginTop: 20,
      fontSize: 24,
      color: theme.colors.primary,
      textAlign: 'center',
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
