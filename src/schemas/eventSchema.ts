import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  venue: z
    .string()
    .min(1, 'Venue is required')
    .min(3, 'Venue must be at least 3 characters')
    .max(100, 'Venue must be less than 100 characters')
    .trim(),
  
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Event date cannot be in the past'),
  
  time: z
    .string()
    .optional(),
  
  organizer: z
    .string()
    .optional(),
  
  capacity: z
    .number()
    .optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

// Schema for venue/date collision validation
export const venueDateCollisionSchema = z.object({
  venue: z.string().min(1, 'Venue is required'),
  date: z.string().min(1, 'Date is required'),
});

export type VenueDateCollisionData = z.infer<typeof venueDateCollisionSchema>; 