import CalendarEvent from '@/components/CalendarEvent';
import {useEvents} from '@/contexts/EventsContext';
import {Overlay, Text} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {useCallback, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Calendar as BigCalendar,
  ICalendarEventBase,
} from 'react-native-big-calendar';

type EventMerged = ICalendarEventBase & {id: string};

const Calendar = () => {
  const {height, width} = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);

  const {
    setEventDetails,
    eventDetails,
    events,
    calendarMode,
    calendarDate,
    setCalendarDate,
    setCalendarMode,
    getEvents,
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

  const onRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      getEvents();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [getEvents]);

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      refreshControl={
        // also shows the loading state while waiting or submitting from biometrics
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }>
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
      <View style={{flex: 1}}>
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
            id: event.id,
            start: dayjs(event.start).toDate(),
            end: dayjs(event.end).toDate(),
          }))}
          calendarCellStyle={{borderColor: 'lightgray'}}
          weekStartsOn={1}
          mode={calendarMode}
          date={calendarDate}
          showAdjacentMonths
        />
      </View>
    </ScrollView>
  );
};

export default Calendar;
