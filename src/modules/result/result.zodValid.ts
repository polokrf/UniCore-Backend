import z from 'zod';

const marks = z
  .number('give number value')
  .int('give whole number value')
  .min(0, 'marks must be at least 0')
  .max(100, 'marks must be at most 100');
const grade = z.enum([
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
]);
const gradePoint = z
  .number('give number value')
  .min(0, 'grade point must be at least 0')
  .max(4, 'grade point must be at most 4');

export const createResult = z.object({
  enrollmentId: z.string('give string id'),
  marks,
  grade,
  gradePoint,
});

// correct a result or publish / unpublish it; at least one field is required
export const updateResult = z
  .object({
    marks: marks.optional(),
    grade: grade.optional(),
    gradePoint: gradePoint.optional(),
    published: z.boolean('published must be true or false').optional(),
  })
  .refine(data => Object.values(data).some(v => v !== undefined), {
    message: 'send at least one field to update',
  });
