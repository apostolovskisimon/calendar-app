import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IconNode} from '@rneui/base';
import {ReactNode} from 'react';
import {KeyboardTypeOptions} from 'react-native';

export type LoginData = {
  email: string;
  password: string;
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

type PublicStackParamList = {
  Welcome: undefined;
  Register: undefined;
};

export type PublicScreenProps = NativeStackScreenProps<PublicStackParamList>;
