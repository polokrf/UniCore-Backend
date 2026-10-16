import z from 'zod'

export const createTeacher = z.object({
  departmentId: z.string('only provide string departmentId'),
  designation: z.string('only provide string data'),
  phone: z.string('only provide string data'),
  qualification: z.string('only provide string data'),
  specialization: z.string('only provide string data'),
  bio: z.string('only provide string data'),
});

export const updateTeacher = z.object({

  phone: z.string('only provide string').optional(),
  qualification: z.string('only provide string').optional(),
  specialization: z.string('only provide string').optional(),
  bio: z.string('only provide string').optional(),
});