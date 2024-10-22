import {Event} from '@/services/types';
import {Theme} from '@rneui/base';
import {Button, Text, useTheme} from '@rneui/themed';
import dayjs from 'dayjs';
import {useFormikContext} from 'formik';
import React, {FC, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

type Props = {
  name: keyof Event; // hard coded, but should be dynamic
  label: string;
  required?: boolean;
};

const DateTimePicker: FC<Props> = ({name, label, required}) => {
  const [openPicker, setOpenPicker] = useState(false);

  const {theme} = useTheme();
  const styles = createStyles(theme);

  const formik = useFormikContext<Event>();

  const value: any = useMemo(() => {
    const val = formik.values[name];
    console.log({val});

    if (val && dayjs(val as string | Date).isValid()) {
      return dayjs(value).toDate();
    }
    return null;
  }, [formik.values, name]);

  const error = useMemo(() => {
    if (formik.touched[name] && formik.errors[name]) {
      return formik.errors[name];
    }
    return null;
  }, [formik.errors, formik.touched, name]);

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
      {error && <Text style={styles.error}>{error}</Text>}

      <DatePicker
        date={value ?? new Date()}
        modal
        open={openPicker}
        onCancel={() => setOpenPicker(false)}
        onConfirm={date => {
          formik.setFieldValue(name, date);
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
