import Icon from '@/components/Icon';
import {InputProps} from '@/services/types';
import {Theme} from '@rneui/base';
import {Input, useTheme} from '@rneui/themed';
import {useFormikContext} from 'formik';
import React, {useMemo, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';

const ValidatedInput = <T extends object>({
  name,
  label,
  required,
  keyboardType = 'default',
  placeholder = 'Type here',
  secureTextEntry = false,
  IconRight = undefined,
  formik,
  disabled = false,
}: InputProps<T>) => {
  const formikContext = useFormikContext<T>();

  const formikData = useMemo(() => {
    if (formik) return formik;
    return formikContext;
  }, [formik, formikContext]);

  const {values, errors, touched, setFieldValue} = formikData;

  const {theme} = useTheme();
  const styles = createStyles(theme);

  const [showText, setShowText] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Input
        containerStyle={styles.containerStyle}
        value={values[name as keyof T] as string}
        onChangeText={value => setFieldValue(name as string, value)}
        label={label && `${label} ${required ? '*' : ''}`}
        rightIcon={
          IconRight ? (
            <Pressable style={styles.pressableIcon}>{IconRight}</Pressable>
          ) : secureTextEntry ? (
            <Pressable
              style={styles.pressableIcon}
              pressRetentionOffset={12}
              hitSlop={12}
              onPress={() => {
                if (!disabled) {
                  setShowText(prev => !prev);
                  Keyboard.dismiss();
                }
              }}>
              <Icon name={showText ? 'eye-off-outline' : 'eye-outline'} />
            </Pressable>
          ) : undefined
        }
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={!showText && secureTextEntry}
        errorMessage={
          touched[name as keyof T] &&
          errors[name as keyof T] &&
          (errors[name as keyof T] as string)
        }
        errorStyle={styles.error}
        disabled={disabled}
        readOnly={disabled}
      />
    </View>
  );
};

export default ValidatedInput;

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
      marginBottom: 10,
    },
    containerStyle: {paddingLeft: 0, paddingRight: 0},
    error: {
      color: theme.colors.error,
      fontSize: 14,
    },
    pressableIcon: {
      padding: 6,
      zIndex: 1,
    },
  });
};
