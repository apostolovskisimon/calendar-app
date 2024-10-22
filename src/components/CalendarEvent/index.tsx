import DateTimePicker from '@/components/Inputs/DateTimePicker';
import ValidatedInput from '@/components/Inputs/ValidatedInput';
import {useEvents} from '@/contexts/EventsContext';
import {showToast} from '@/helpers/toast';
import {EVENTS} from '@/services/constants';
import {Event} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text} from '@rneui/themed';
import dayjs from 'dayjs';
import {Formik} from 'formik';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

type Props = {};

const intitialValues: Event = {
  startDate: null,
  endDate: null,
  title: null,
};

const schema = Yup.object().shape({
  startDate: Yup.date().required('Start Date is required.').default(null),
  endDate: Yup.date().required('End Date is required.').default(null),
  title: Yup.string().required('Title is required.').default(null),
});

const CalendarEvent = (props: Props) => {
  const {createEvent, isOpenEventDetails} = useEvents();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventData, setEventData] = useState<Event>(intitialValues);

  //   const getEvent = useCallback(
  //     async (id: string) => {
  //       setIsLoading(true);
  //       try {
  //         const saved = await AsyncStorage.getItem(EVENTS);
  //         if (saved) {
  //           const savedEvents: Event[] = JSON.parse(saved);
  //           if (Array.isArray(savedEvents) && savedEvents.length > 0) {
  //             if (isOpenEventDetails.id) {
  //               const currentEvent = savedEvents.find(el => el.id == id);
  //               setEventData(currentEvent || intitialValues);
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         showToast('Error', 'error', "Couldn't load events.");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     },
  //     [isOpenEventDetails.id],
  //   );

  const onSubmitEvent = useCallback(
    async (data: Event) => {
      setIsSubmitting(true);
      try {
        await createEvent(data);
      } catch (error) {
      } finally {
        setIsSubmitting(false);
      }
    },
    [createEvent],
  );

  useEffect(() => {
    if (isOpenEventDetails.open) {
      if (isOpenEventDetails.startDate) {
        console.log(
          'isOpenEventDetails.startDate',
          isOpenEventDetails.startDate,
        );
        setEventData(prevEvent => ({
          ...prevEvent,
          startDate: dayjs(isOpenEventDetails.startDate).toDate() || null,
        }));
        return;
      }
      //   if (isOpenEventDetails.id) {
      //     getEvent(isOpenEventDetails.id);
      //   }
    }
  }, [isOpenEventDetails]);

  //   useEffect(() => {
  //     if (!isOpenEventDetails.open) {
  //       setEventData(intitialValues);
  //     }
  //   }, [isOpenEventDetails.open]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{alignItems: 'center', paddingVertical: 10}}>
      <Text style={{fontSize: 18}}>Event Details</Text>
      <Formik<Event>
        initialValues={eventData}
        validationSchema={schema}
        onSubmit={data => {
          onSubmitEvent(data);
        }}>
        {({handleSubmit}) => (
          <View style={{width: '90%', marginTop: 20}}>
            <DateTimePicker name="startDate" label="Start Date" required />
            <DateTimePicker name="endDate" label="End Date" required />
            <ValidatedInput<Event>
              name="title"
              label="Title"
              required
              placeholder="Enter Title"
            />
            <Button onPress={() => handleSubmit()}>Submit</Button>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default CalendarEvent;
