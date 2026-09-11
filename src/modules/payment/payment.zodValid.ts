import z from 'zod'
export const createPayment = z.object({
  enrollmentId:z.string()
})