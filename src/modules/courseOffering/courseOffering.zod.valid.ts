import z from 'zod'

export const createOffering = z.object({
  courseId: z.string('plz provide a string value'),
  semesterId: z.string('plz provide a string value'),
  section: z.string('plz provide a string value'),
  capacity: z.number().int(),
  fee:z.number().int()
});


export  const updateOffer = z.object({
  section: z.string(' give string').optional(),
  capacity: z.number().int().optional(),
  isActive: z.boolean().optional(),
});


export const assignTeacher = z.object({
  teacherId:z.string('give a string value')
})