import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
