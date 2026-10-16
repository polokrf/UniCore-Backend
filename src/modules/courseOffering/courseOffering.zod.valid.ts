import z from 'zod';

// one definition of a valid teacherId, used by create AND assign
const teacherIdField = z
  .string('give a string value')
  .trim()
  .min(1, 'teacherId is required');

export const createOffering = z.object({
  courseId: z.string('plz provide a string value'),
  semesterId: z.string('plz provide a string value'),
  section: z.string('plz provide a string value'),
  capacity: z.number().int(),
  fee: z.number().int(),
  // optional: assign the teacher in the same step (validated like assign-teacher)
  teacherId: teacherIdField.optional(),
});

export const updateOffer = z.object({
  section: z.string(' give string').optional(),
  capacity: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const assignTeacher = z.object({
  teacherId: teacherIdField,
});
