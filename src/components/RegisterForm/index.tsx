import Icon from '@/components/Icon';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {showToast} from '@/helpers/toast';
import {PASSWORD_REGEX} from '@/services/constants';
import {createAccount} from '@/services/firebase';
import {FirebaseAuthError, Navigation, RegisterData} from '@/services/types';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/themed';
import {Formik} from 'formik';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const initialValues: RegisterData = {
  email: '',
  password: '',
  confirmPassword: '',
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
  const navigation = useNavigation<Navigation>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (values: RegisterData) => {
      setIsSubmitting(true);
      try {
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
    [navigation],
  );

  return (
    <KeyboardAwareScrollView
      style={{marginTop: 30, paddingBottom: 30}}
      keyboardShouldPersistTaps="always">
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
    marginTop: 10,
  },
  bioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
});
