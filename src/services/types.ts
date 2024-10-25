import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FormikProps} from 'formik';
import {ReactNode} from 'react';
import {KeyboardTypeOptions} from 'react-native';

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = LoginData & {
  confirmPassword: string;
  confirmBiometrics: boolean;
};

export type InputProps<T extends object> = {
  name: keyof T;
  required?: boolean;
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  IconRight?: ReactNode;
  formik?: FormikProps<T>;
  disabled?: boolean;
};

export type PublicStackParamList = {
  Welcome: undefined;
  Register: undefined;
  'Complete Registration': {
    email: string;
  };
};

export type PublicScreenProps = NativeStackScreenProps<PublicStackParamList>;

export type FirebaseAuthError = {
  userInfo: {
    code: string;
    message: string;
  };
};

export type Navigation = {
  navigate: (value: string, params?: Object) => void;
};

export type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export type User = Partial<FirebaseAuthTypes.User> | null;

export type Event = {
  title: string;
  start: Date | string | null;
  end: Date | string | null;
  id: string;
};
