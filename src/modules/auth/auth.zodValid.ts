import * as z from 'zod'

export const registerPayload = z.object({
  firstName: z.string('not a string'),
  email: z.email('plz only provide email'),
  password: z.string().min(6, 'plz provide 6 digit pin number')
  
});

export const verifyEmailPayload = z.object({
  email: z.email('plz only provide email'),
  otp:z.string().max(6,'plz give valid 6 digit opt number')
});

export const loginPayload = z.object({
  email: z.email('plz provide valid email'),
  password: z.string().min(6, 'plz provide 6 digit pin number'),
});