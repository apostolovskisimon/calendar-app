import {Theme} from '@rneui/base';
import {Button, Text, useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import {FormikProps} from 'formik';
import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

type Props<T extends object> = {
  name: keyof T;
  label: string;
  required?: boolean;
  formik: FormikProps<T>;
};

const DateTimePicker = <T extends object>({
  name,
  label,
  required,
  formik,
}: Props<T>) => {
  const [openPicker, setOpenPicker] = useState(false);

  const {theme} = useTheme();
  const styles = createStyles(theme);

  const {values, errors, touched, setFieldValue} = formik;
  const value: Date | null = useMemo(() => {
    const val = values[name];
    if (val && dayjs(val as string | Date).isValid()) {
      return dayjs(val as string | Date).toDate();
    }
    return null;
  }, [name, values]);

  const error = useMemo(() => {
    if (touched && touched[name] && !!errors && errors[name]) {
      return errors[name];
    }
    return null;
  }, [errors, touched, name]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelContainer}>
          {label} {required ? '*' : ''}
        </Text>
        <Button
          containerStyle={styles.buttonContainer}
          type="outline"
          title={
            value && dayjs(value).isValid()
              ? dayjs(value).format('DD-MM-YYYY HH:mm')
              : 'Select a date'
          }
          onPress={() => setOpenPicker(true)}
        />
      </View>
      {error && <Text style={styles.error}>{error as string}</Text>}

      <DatePicker
        date={value ?? new Date()}
        modal
        open={openPicker}
        onCancel={() => setOpenPicker(false)}
        onConfirm={date => {
          setFieldValue(name as string, dayjs(date).format());
          setOpenPicker(false);
        }}
      />
    </View>
  );
};

export default DateTimePicker;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {marginBottom: 20},
    labelContainer: {},
    label: {
      textAlign: 'left',
      marginBottom: 10,
    },
    buttonContainer: {
      marginTop: 5,
      width: '100%',
    },
    error: {
      alignSelf: 'flex-start',
      marginTop: 5,
      color: theme.colors.error,
    },
  });
