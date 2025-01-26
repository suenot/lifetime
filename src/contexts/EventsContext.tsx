'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Event, EventGroup } from '../types/events';

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

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [displayMode, setDisplayMode] = useState<'compact' | 'large'>('compact');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addEvent = useCallback((event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const updateEvent = useCallback((event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode(prev => prev === 'compact' ? 'large' : 'compact');
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const getEventsForWeek = useCallback((weekId: string) => {
    return events.filter(event => {
      if (event.type === 'single') {
        const eventWeek = new Date(event.date).getWeek();
        const eventYear = new Date(event.date).getFullYear();
        return `${eventYear}-${eventWeek.toString().padStart(2, '0')}` === weekId;
      } else {
        const startWeek = new Date(event.startDate).getWeek();
        const startYear = new Date(event.startDate).getFullYear();
        const endWeek = new Date(event.endDate).getWeek();
        const endYear = new Date(event.endDate).getFullYear();
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
