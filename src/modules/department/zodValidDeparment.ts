import z from 'zod'

export const createDepartment = z.object({
  name: z.string('plz provide a string'),
  code: z.string('plz provide a string like CSE'),
  description: z.string('plz provide a string'),
});

export const updateDepartment = z.object({
  id: z.string(),
  name: z.string('plz provide a string').optional(),
  code: z.string('plz provide a string').optional(),
  description: z.string('plz provide a string').optional(),
  isActive: z.boolean('plz provide a string').optional(),
});