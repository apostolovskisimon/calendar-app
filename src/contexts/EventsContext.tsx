import {useAuth} from '@/contexts/AuthContext';
import {showToast} from '@/helpers/toast';
import {EVENTS} from '@/services/constants';
import {Event, EventModalState} from '@/services/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

type EventsState = {
  createEvent: (event: Event) => Promise<boolean>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setIsOpenEventDetails: React.Dispatch<React.SetStateAction<EventModalState>>;
  isOpenEventDetails: EventModalState;
};

const initialState: EventsState = {
  createEvent: async () => false,
  events: [],
  setEvents: () => {},
  isOpenEventDetails: {open: false, startDate: null, id: null},
  setIsOpenEventDetails: () => {},
};

const EventsContext = createContext<EventsState>(initialState);

const EventsContextProvider = ({children}: {children: ReactNode}) => {
  const {user} = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  const [isOpenEventDetails, setIsOpenEventDetails] = useState<EventModalState>(
    initialState.isOpenEventDetails,
  );

  const createEvent = useCallback(
    async (event: Event) => {
      const id = dayjs().unix().toString(); // unix to act as a unique id

      const newEvent: Event = {
        ...event,
        id,
      };
      const eventsInTotal = [...events, newEvent];
      try {
        setEvents(eventsInTotal);
        await AsyncStorage.setItem(EVENTS, JSON.stringify(eventsInTotal));
        return Promise.resolve(true);
      } catch (error) {
        showToast('Error', 'error', "Couldn't save event. Try again");
        return Promise.resolve(false);
      }
    },
    [events],
  );

  return (
    <EventsContext.Provider
      value={{
        createEvent,
        events,
        setEvents,
        isOpenEventDetails,
        setIsOpenEventDetails,
      }}>
      {children}
    </EventsContext.Provider>
  );
};

const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error('Events context not avaialble.');

  return context;
};

export {EventsContextProvider, useEvents};
