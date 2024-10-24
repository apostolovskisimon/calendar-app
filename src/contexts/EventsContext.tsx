import Drawer from '@/components/Drawer';
import {useAuth} from '@/contexts/AuthContext';
import {showToast} from '@/helpers/toast';
import {EVENTS} from '@/services/constants';
import {Event} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {DrawerLayoutAndroid, Platform} from 'react-native';
import {Mode} from 'react-native-big-calendar';

type EventsState = {
  submitEvent: (event: Event) => Promise<boolean>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setEventDetails: React.Dispatch<React.SetStateAction<Event | null>>;
  eventDetails: Event | null;
  isSubmitting: boolean;
  getEvents: () => Promise<boolean>;
  onOpenDrawer: () => void;
  calendarMode: Mode;
  setCalendarMode: React.Dispatch<React.SetStateAction<Mode>>;
  calendarDate: Date;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
  deleteEvent: (id: string) => Promise<void>;
};

const initialState: EventsState = {
  submitEvent: async () => false,
  events: [],
  setEvents: () => {},
  eventDetails: null,
  setEventDetails: () => {},
  isSubmitting: false,
  getEvents: async () => false,
  onOpenDrawer: () => {},
  calendarMode: 'week',
  calendarDate: new Date(),
  setCalendarMode: () => {},
  setCalendarDate: () => {},
  deleteEvent: async () => {},
};

const EventsContext = createContext<EventsState>(initialState);

const EventsContextProvider = ({children}: {children: ReactNode}) => {
  const {user} = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [calendarMode, setCalendarMode] = useState<Mode>('week');
  const [calendarDate, setCalendarDate] = useState(new Date());

  const onOpenDrawer = () => {
    drawerRef?.current?.openDrawer();
  };
  const onChangeCalendarMode = useCallback((mode: Mode) => {
    setCalendarDate(new Date());
    setCalendarMode(mode);
    drawerRef?.current?.closeDrawer();
  }, []);

  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const submitEvent = useCallback(
    async (event: Event) => {
      setIsSubmitting(true);
      try {
        // is edit mode
        if (event.id) {
          const editedEvents = events.map(el => {
            if (el.id === event.id) {
              return {...event};
            }
            return el;
          });

          setEvents(editedEvents);
          await AsyncStorage.setItem(EVENTS, JSON.stringify(editedEvents));
          setEventDetails(null);
          return Promise.resolve(true);
        } else {
          const id = dayjs().unix().toString(); // unix to act as a unique id

          const newEvent: Event = {
            ...event,
            id,
          };
          const newEvents = [...events, newEvent];
          setEvents(newEvents);
          await AsyncStorage.setItem(EVENTS, JSON.stringify(newEvents));
          setEventDetails(null);
          return Promise.resolve(true);
        }
      } catch (error) {
        showToast('Error', 'error', "Couldn't save event. Try again");
        return Promise.resolve(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [events],
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        const filteredEvents = events.filter(el => el.id !== id);
        setEvents(filteredEvents);
        await AsyncStorage.setItem(EVENTS, JSON.stringify(filteredEvents));
        setEventDetails(null);
      } catch (error) {
        showToast('Error', 'error', "Couldn't delete event. Try again");
      }
    },
    [events],
  );

  const getEvents = useCallback(async () => {
    try {
      const savedEvents = await AsyncStorage.getItem(EVENTS);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents) as Event[];
        setEvents(parsedEvents);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (error) {
      showToast('Error', 'error', "Couldn't load events. Try again");
      return Promise.resolve(false);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <EventsContext.Provider
      value={{
        submitEvent,
        events,
        setEvents,
        eventDetails,
        setEventDetails,
        isSubmitting,
        getEvents,
        onOpenDrawer,
        calendarMode,
        calendarDate,
        setCalendarDate,
        setCalendarMode,
        deleteEvent,
      }}>
      {Platform.OS === 'android' ? (
        <Drawer ref={drawerRef} onChangeCalendarMode={onChangeCalendarMode}>
          {children}
        </Drawer>
      ) : (
        children
      )}
    </EventsContext.Provider>
  );
};

const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error('Events context not avaialble.');

  return context;
};

export {EventsContextProvider, useEvents};
