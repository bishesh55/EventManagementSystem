import { EventFormData as ZodEventFormData } from '../schemas/eventSchema';

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time?: string;
  organizer?: string;
  capacity?: number;
  isPast: boolean;
}

export type EventFormData = ZodEventFormData; 