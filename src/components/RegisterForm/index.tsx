import React, {useCallback, useState} from 'react';
import {FirebaseAuthError, LoginData, RegisterData} from '@/services/types';
import * as Yup from 'yup';
import {Formik, FormikHelpers} from 'formik';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {Button, Text} from '@rneui/themed';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import Icon from '@/components/Icon';
import {PASSWORD_REGEX} from '@/services/constants';
import {showToast} from '@/helpers/toast';
import createAccount from '@/services/firebase/createAccount';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

const initialValues: RegisterData = {
  email: 'apostolovskisimon@gmail.com',
  password: 'Apostolot1!',
  confirmPassword: 'Apostolot1!',
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
});

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (
      values: RegisterData,
      formikHelpers: FormikHelpers<RegisterData>,
    ) => {
      //   showToast('Success', 'info', 'your acc is codd');
      setIsSubmitting(true);

      try {
        const response = await createAccount(values.email, values.password);
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

    [],
  );

  return (
    <View style={{marginTop: 30}}>
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
    </View>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  loginButton: {
    width: 150,
    color: 'black',
  },
});
