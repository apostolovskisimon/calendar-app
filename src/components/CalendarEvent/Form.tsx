import DateTimePicker from '@/components/Inputs/DateTimePicker';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {useEvents} from '@/contexts/EventsContext';
import {Event} from '@/services/types';
import {Button} from '@rneui/themed';
import {FormikProps} from 'formik';
import React, {FC} from 'react';
import {Keyboard, View} from 'react-native';

type Props = {
  formik: FormikProps<Event>;
};

const EventForm: FC<Props> = ({formik}) => {
  const {deleteEvent, isSubmitting} = useEvents();
  return (
    <View style={{width: '90%', marginTop: 20}}>
      <DateTimePicker<Event>
        name="start"
        label="Start Date"
        required
        formik={formik}
      />
      <DateTimePicker<Event>
        name="end"
        label="End Date"
        required
        formik={formik}
      />
      <ValidatedInput<Event>
        name="title"
        label="Title"
        required
        placeholder="Enter Title"
        formik={formik}
      />
      <View style={{flexDirection: 'row', gap: 10, alignSelf: 'flex-end'}}>
        {formik.values.id && (
          <Button
            title="Delete?"
            onPress={() => {
              Keyboard.dismiss();
              deleteEvent(formik.values.id);
            }}
            color={'error'}
            containerStyle={{alignSelf: 'center', width: 100}}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        )}
        <Button
          containerStyle={{alignSelf: 'center', width: 100}}
          color={'success'}
          title="Submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={() => {
            Keyboard.dismiss();
            formik.handleSubmit();
          }}
        />
      </View>
    </View>
  );
};
export default EventForm;
