import { z } from 'zod';

export const createClassRoutine= z.object({
    courseOfferingId: z.string('give string id'),

    day: z.enum([
      'SATURDAY',
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ]),

    startTime: z.string().regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        'Start time must be in HH:mm format',
      ),

    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format'),

    room: z .string().trim().min(1, 'Room is required')
      .max(50, 'Room is too long'),
  })
  .refine(data => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });


export const updateClassRoutine= z.object({
   day: z.enum([
      'SATURDAY',
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ]).optional(),

    startTime: z.string().regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        'Start time must be in HH:mm format',
      ).optional(),

    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format').optional(),

    room: z .string().trim().min(1, 'Room is required')
      .max(50, 'Room is too long').optional(),
  })
  
