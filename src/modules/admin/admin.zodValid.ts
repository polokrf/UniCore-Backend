 import z from 'zod'

export const updateTeacherStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});
