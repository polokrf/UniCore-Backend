import z from 'zod'

export const enrollNow = z.object({
  courseOfferingId:z.string(),
});