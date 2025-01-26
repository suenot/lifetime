export type EventType = 'single' | 'range';

export interface BaseEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  color?: string;
  imageUrl?: string;
}

export interface SingleEvent extends BaseEvent {
  type: 'single';
  date: string; // ISO date string
}

export interface RangeEvent extends BaseEvent {
  type: 'range';
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export type Event = SingleEvent | RangeEvent;

export interface EventGroup {
  weekId: string; // Format: YYYY-WW
  events: Event[];
}
