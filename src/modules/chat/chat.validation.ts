import z from "zod";

export const SendChatMessageZodSchema = z.object({
  message: z.string('message Is Required').trim().min(1,"message Cannot Be Empty").max(1000,'message cannot be longer than 1000 characters'),
  sessionId: z.uuid("Session Id Must Be A Valid UUID").optional()
})