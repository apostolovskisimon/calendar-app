import EventForm from '@/components/CalendarEvent/Form';
import {useEvents} from '@/contexts/EventsContext';
import {Event} from '@/services/types';
import {Text} from '@rneui/themed';
import {useFormik} from 'formik';
import React, {useCallback} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const intitialValues: Event = {
  start: null,
  end: null,
  title: '',
  id: '',
};

const schema = Yup.object().shape({
  start: Yup.date().required('Start Date is required.').default(null),
  end: Yup.date().required('End Date is required.').default(null),
  title: Yup.string().required('Title is required.').default(''),
  id: Yup.string(),
});

const CalendarEvent = () => {
  const {submitEvent, eventDetails} = useEvents();

  const onSubmitEvent = useCallback(
    async (data: Event) => {
      submitEvent(data);
    },
    [submitEvent],
  );

  const formik = useFormik<Event>({
    initialValues: eventDetails ? {...eventDetails} : intitialValues,
    validationSchema: schema,
    onSubmit: onSubmitEvent,
  });

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{alignItems: 'center', paddingVertical: 10}}>
      <Text style={{fontSize: 18}}>Event Details</Text>
      <EventForm formik={formik} />
    </KeyboardAwareScrollView>
  );
};

export default CalendarEvent;
