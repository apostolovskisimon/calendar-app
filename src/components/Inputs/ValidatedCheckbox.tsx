import Icon from '@/components/Icon';
import {InputProps} from '@/services/types';
import {Theme} from '@rneui/base';
import {CheckBox, Text, useTheme} from '@rneui/themed';
import {useFormikContext} from 'formik';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const ValidatedCheckbox = <T extends object>({
  name,
  label,
  required,
}: InputProps<T>) => {
  const {errors, touched, values, setFieldValue} = useFormikContext<T>();

  const {theme} = useTheme();
  const styles = createStyles(theme);

  return (
    <View>
      <View>
        <CheckBox
          containerStyle={styles.checkboxContainer}
          checked={!!values[name as keyof T]}
          title={`${label || ''} ${required ? '*' : ''}`}
          titleProps={{style: styles.label}}
          checkedIcon={<Icon name="checkmark-circle-outline" size={24} />}
          uncheckedIcon={<Icon name="ellipse-outline" size={24} />}
          onPress={() =>
            setFieldValue(name as string, !values[name as keyof T])
          }
        />
      </View>
      {touched[name as keyof T] && errors[name as keyof T] && (
        <Text style={styles.error}>{errors[name as keyof T] as string}</Text>
      )}
    </View>
  );
};

export default ValidatedCheckbox;

const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    checkboxContainer: {paddingLeft: 0, marginLeft: 0},
    error: {
      color: theme.colors.error,
      fontSize: 14,
    },
    pressableIcon: {
      padding: 6,
      zIndex: 1,
    },
    label: {
      color: theme.colors.grey3,
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 6,
    },
  });
};
