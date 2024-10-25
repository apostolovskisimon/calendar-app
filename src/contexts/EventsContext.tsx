import Drawer from '@/components/Drawer';
import {showToast} from '@/helpers/toast';
import {
  addUserEvent,
  editUserEvent,
  getUserEvents,
  removeUserEvent,
} from '@/services/firebase/firestore';
import {showNotification} from '@/services/notifications';
import {Event} from '@/services/types';
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

  const getEvents = useCallback(async () => {
    try {
      const savedDocs = await getUserEvents();

      const arrEvents = savedDocs?.docs;

      const dbEvents: Event[] =
        arrEvents?.map(el => {
          return {...(el.data() as Event), id: el.id};
        }) || [];
      setEvents(dbEvents);
      return Promise.resolve(true);
    } catch (error) {
      showToast('Error', 'error', "Couldn't load events. Try again");
      return Promise.resolve(false);
    }
  }, []);

  const submitEvent = useCallback(
    async (event: Event) => {
      setIsSubmitting(true);
      try {
        // is edit mode
        if (event.id) {
          // save edited to firebase
          await editUserEvent(event.id!, event);
          // reload data
          getEvents();
          setEventDetails(null);
          await showNotification(event.title, 'The event has been modified.');
          return Promise.resolve(true);
        } else {
          const newEvent: Event = {
            ...event,
          };
          // save new to firebase
          await addUserEvent(newEvent);
          // reload data
          getEvents();
          setEventDetails(null);
          await showNotification(event.title, 'Event has been created.');
          return Promise.resolve(true);
        }
      } catch (error) {
        showToast('Error', 'error', "Couldn't save event. Try again");
        return Promise.resolve(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [getEvents],
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        // remove from firebase
        await removeUserEvent(id);
        // reload data
        getEvents();
        setEventDetails(null);
        showNotification('Event has been deleted', '');
      } catch (error) {
        showToast('Error', 'error', "Couldn't delete event. Try again");
      }
    },
    [getEvents],
  );

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
