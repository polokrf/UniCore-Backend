import z from 'zod'

export const createTeacher = z.object({
  userId: z.string('only provide string userId'),
  departmentId: z.string('only provide string departmentId'),
  designation: z.string('only provide string data'),
  phone: z.string('only provide string data').optional(),
  qualification: z.string('only provide string data').optional(),
  specialization: z.string('only provide string data').optional(),
  joiningDate: z.string('only provide string date').optional(),
  bio: z.string('only provide string data').optional(),
});

export const updateTeacher = z.object({

  phone: z.string('only provide string').optional(),
  qualification: z.string('only provide string').optional(),
  specialization: z.string('only provide string').optional(),
  bio: z.string('only provide string').optional(),
});