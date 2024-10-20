import Icon from '@/components/Icon';
import ValidatedCheckbox from '@/components/Inputs/ValidatedCheckbox';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {useAuth} from '@/contexts/AuthContext';
import {showToast} from '@/helpers/toast';
import useBiometrics from '@/hooks/useBiometrics';
import {PASSWORD_REGEX} from '@/services/constants';
import createAccount from '@/services/firebase/createAccount';
import {FirebaseAuthError, Navigation, RegisterData} from '@/services/types';
import {useNavigation} from '@react-navigation/native';
import {Button, Text, Tooltip} from '@rneui/themed';
import {Formik} from 'formik';
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const initialValues: RegisterData = {
  email: 'apostolovskisimon@gmail.com',
  password: 'Apostolot1!',
  confirmPassword: 'Apostolot1!',
  confirmBiometrics: false,
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.')
    .matches(
      PASSWORD_REGEX,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password Confirmation is required.'),
  confirmBiometrics: Yup.boolean().default(false).nullable(),
});

const RegisterForm = () => {
  const {canSaveBiometrics} = useAuth();
  const {saveCredentials} = useBiometrics();

  const navigation = useNavigation<Navigation>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: RegisterData) => {
      setIsSubmitting(true);
      try {
        if (canSaveBiometrics && values.confirmBiometrics) {
          await saveCredentials(values.email);
        }
        await createAccount(values.email, values.password);
        setIsSubmitting(false);
        navigation.navigate('Welcome');
      } catch (error) {
        showToast(
          'Error',
          'error',
          (error as FirebaseAuthError)?.userInfo?.message ||
            'Something went wrong.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [canSaveBiometrics, navigation, saveCredentials],
  );

  return (
    <KeyboardAwareScrollView style={{marginTop: 30}}>
      <Formik<RegisterData>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}>
        {({handleSubmit}) => (
          <>
            <ValidatedInput<RegisterData>
              name="email"
              required
              label="Email"
              placeholder="Enter Email"
              keyboardType="email-address"
              IconRight={<Icon name="mail-outline" />}
            />
            <ValidatedInput<RegisterData>
              name="password"
              required
              label="Password"
              placeholder="Enter Password"
              secureTextEntry
            />
            <ValidatedInput<RegisterData>
              name="confirmPassword"
              required
              label="Confirm Password"
              placeholder="Enter Password Again"
              secureTextEntry
            />
            {/* if defice doesnt support biometrics then biometrics are ignored */}
            {canSaveBiometrics && (
              <View style={styles.bioInfo}>
                <ValidatedCheckbox<RegisterData>
                  name="confirmBiometrics"
                  label="Use biometrics?"
                />
                <Tooltip
                  visible={tooltipOpen}
                  onOpen={() => setTooltipOpen(true)}
                  onClose={() => setTooltipOpen(false)}
                  containerStyle={styles.tooltip}
                  popover={
                    <ScrollView>
                      <Text>
                        After the first log in, you will be able to log in with
                        biometrics if you prefer.
                      </Text>
                      <Text>
                        Otherwise you will have to enter your credentials on
                        each log in.
                      </Text>
                    </ScrollView>
                  }>
                  <Icon name="information-circle-outline" size={20} />
                </Tooltip>
              </View>
            )}
            <Button
              loading={isSubmitting}
              disabled={isSubmitting}
              containerStyle={styles.loginButton}
              onPress={() => handleSubmit()}>
              Create Account
            </Button>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  loginButton: {
    width: 150,
    color: 'black',
    marginTop: 30,
  },
  bioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  tooltip: {
    minHeight: 180,
    paddingBottom: 10,
    backgroundColor: 'lightgray',
  },
});
