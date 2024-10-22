import CalendarEvent from '@/components/CalendarEvent';
import {useEvents} from '@/contexts/EventsContext';
import {Overlay} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Calendar as BigCalendar} from 'react-native-big-calendar';

type Props = {};

const Calendar = (props: Props) => {
  const {height, width} = useWindowDimensions();

  const {setIsOpenEventDetails, isOpenEventDetails} = useEvents();

  return (
    <View style={{flex: 1}}>
      <Overlay
        isVisible={isOpenEventDetails.open}
        overlayStyle={{
          width: width - 40,
          maxHeight: height - 240,
        }}
        onBackdropPress={() =>
          setIsOpenEventDetails({open: false, id: null, startDate: null})
        }>
        <CalendarEvent />
      </Overlay>
      <BigCalendar
        height={height}
        onPressCell={date => {
          setIsOpenEventDetails({open: true, startDate: date, id: null});
        }}
        onPressEvent={event => {
          setIsOpenEventDetails({
            open: true,
            id: event.id,
            startDate: event.start,
          });
        }}
        events={[
          {
            start: dayjs().toDate(),
            end: dayjs().add(2, 'h').toDate(),
            title: 'title',
            id: 'test',
          },
        ]}
        calendarCellStyle={{borderColor: 'lightgray'}}
      />
    </View>
  );
};

export default Calendar;
