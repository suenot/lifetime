'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Event, EventGroup } from '../types/events';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface EventsContextType {
  events: Event[];
  displayMode: 'compact' | 'large';
  isDrawerOpen: boolean;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  toggleDisplayMode: () => void;
  toggleDrawer: () => void;
  getEventsForWeek: (weekId: string) => Event[];
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'lifetime_events',
  DISPLAY_MODE: 'lifetime_display_mode',
  DRAWER_STATE: 'lifetime_drawer_state',
} as const;

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useLocalStorage<Event[]>(STORAGE_KEYS.EVENTS, []);
  const [displayMode, setDisplayMode] = useLocalStorage<'compact' | 'large'>(
    STORAGE_KEYS.DISPLAY_MODE,
    'compact'
  );
  const [isDrawerOpen, setIsDrawerOpen] = useLocalStorage<boolean>(
    STORAGE_KEYS.DRAWER_STATE,
    false
  );

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, [setEvents]);

  const updateEvent = useCallback((event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  }, [setEvents]);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, [setEvents]);

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode(prev => prev === 'compact' ? 'large' : 'compact');
  }, [setDisplayMode]);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, [setIsDrawerOpen]);

  const getEventsForWeek = useCallback((weekId: string) => {
    return events.filter(event => {
      if (event.type === 'single') {
        const eventDate = new Date(event.date);
        const eventWeek = eventDate.getWeek();
        const eventYear = eventDate.getFullYear();
        return `${eventYear}-${eventWeek.toString().padStart(2, '0')}` === weekId;
      } else {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const startWeek = startDate.getWeek();
        const startYear = startDate.getFullYear();
        const endWeek = endDate.getWeek();
        const endYear = endDate.getFullYear();
        const [year, week] = weekId.split('-').map(Number);
        
        if (startYear === endYear) {
          return year === startYear && week >= startWeek && week <= endWeek;
        } else {
          return (year === startYear && week >= startWeek) ||
                 (year === endYear && week <= endWeek) ||
                 (year > startYear && year < endYear);
        }
      }
    });
  }, [events]);

  return (
    <EventsContext.Provider
      value={{
        events,
        displayMode,
        isDrawerOpen,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleDisplayMode,
        toggleDrawer,
        getEventsForWeek,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}

// Добавляем метод getWeek для Date
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function(): number {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};
