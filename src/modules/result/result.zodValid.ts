import z from 'zod';

export const createResult = z.object({
  enrollmentId: z.string('give string id'),

  marks: z.number().int('give whole number value'),

  grade: z.enum([
    'A_PLUS',
    'A',
    'A_MINUS',
    'B_PLUS',
    'B',
    'B_MINUS',
    'C_PLUS',
    'C',
    'D',
    'F',
  ]),

  gradePoint: z.number('give number value'),
});
