import CalendarEvent from '@/components/CalendarEvent';
import {useEvents} from '@/contexts/EventsContext';
import {Overlay, Text} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useCallback} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {
  Calendar as BigCalendar,
  ICalendarEventBase,
} from 'react-native-big-calendar';

type EventMerged = ICalendarEventBase & {id: string};

const Calendar = () => {
  const {height, width} = useWindowDimensions();

  const {
    setEventDetails,
    eventDetails,
    events,
    calendarMode,
    calendarDate,
    setCalendarDate,
    setCalendarMode,
  } = useEvents();

  const onPressDateHeader = useCallback(
    (date: Date) => {
      setCalendarDate(date);
      setCalendarMode('day');
    },
    [setCalendarDate, setCalendarMode],
  );

  const onSwipeEnd = useCallback(
    (date: Date) => {
      setCalendarDate(date);
    },
    [setCalendarDate],
  );

  return (
    <View style={{flex: 1}}>
      <Overlay
        isVisible={!!eventDetails}
        overlayStyle={{
          width: width - 40,
          maxHeight: height - 240,
        }}
        onBackdropPress={() => setEventDetails(null)}>
        {!!eventDetails && <CalendarEvent />}
      </Overlay>
      <Text style={{textAlign: 'center', marginVertical: 10, fontSize: 20}}>
        {dayjs(calendarDate).format('MMMM YYYY')}
      </Text>
      <ScrollView style={{flex: 1}}>
        <BigCalendar
          onPressDateHeader={onPressDateHeader}
          onSwipeEnd={onSwipeEnd}
          height={height}
          onPressCell={date => {
            setEventDetails({
              start: dayjs(date).format(),
              end: null,
              title: '',
              id: '',
            });
          }}
          onPressEvent={event => {
            setEventDetails({
              id: event.id,
              start: dayjs(event.start).format(),
              end: dayjs(event.end).format(),
              title: event.title,
            });
          }}
          events={(events as EventMerged[]).map(event => ({
            ...event,
            start: dayjs(event.start).toDate(),
            end: dayjs(event.end).toDate(),
          }))}
          calendarCellStyle={{borderColor: 'lightgray'}}
          weekStartsOn={1}
          mode={calendarMode}
          date={calendarDate}
          showAdjacentMonths
        />
      </ScrollView>
    </View>
  );
};

export default Calendar;
