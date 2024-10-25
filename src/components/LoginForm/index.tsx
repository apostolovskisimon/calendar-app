import React from 'react';
import {LoginData} from '@/services/types';
import * as Yup from 'yup';
import {Formik} from 'formik';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {Button, Text} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import Icon from '@/components/Icon';
import {PASSWORD_REGEX} from '@/services/constants';
import {useAuth} from '@/contexts/AuthContext';

const initialValues: LoginData = {
  email: '',
  password: '',
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
});

const LoginForm = () => {
  const {submitCredentials, isLoading} = useAuth();

  return (
    <View>
      <View style={styles.withMarginBottom}>
        <Text style={styles.withMarginBottom}>
          Log In with your credentials
        </Text>
      </View>
      <Formik<LoginData>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={data => submitCredentials(data)}>
        {({handleSubmit}) => (
          <>
            <ValidatedInput<LoginData>
              name="email"
              required
              label="Email"
              placeholder="Enter Email"
              keyboardType="email-address"
              IconRight={<Icon name="mail-outline" />}
            />
            <ValidatedInput<LoginData>
              name="password"
              required
              label="Password"
              placeholder="Enter Password"
              secureTextEntry
            />
            <Button
              loading={isLoading}
              disabled={isLoading}
              containerStyle={styles.loginButton}
              onPress={() => handleSubmit()}>
              Log In
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  loginButton: {
    width: 150,
    color: 'black',
  },
  withMarginBottom: {marginTop: 10, marginBottom: 10},
});
