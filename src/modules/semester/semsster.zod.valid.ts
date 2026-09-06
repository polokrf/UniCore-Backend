import z from 'zod'

export const createSemester = z.object({
  name: z.string('plz provide valid sting'),
  year: z.number().int().min(4),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const updateSemester = z.object({
  name: z.string('plz provide valid sting').optional(),
  year: z.number().int().min(4).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});