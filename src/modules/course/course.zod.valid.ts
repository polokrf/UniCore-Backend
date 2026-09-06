import z from 'zod'

export const crateCourse = z.object({
  departmentId: z.string('give string value'),
  code: z.string('give string value'),
  title: z.string('give string value'),
  description: z.string('give string value').optional(),
  credit: z.int('give  a number value'),
});
export const updateCourse = z.object({
  code: z.string('give string value').optional(),
  title: z.string('give string value').optional(),
  description: z.string('give string value').optional(),
  credit: z.int('give  a number value').optional(),
});