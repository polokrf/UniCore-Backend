import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as z from 'zod';
import { AppError } from '../utils/AppError';

const zodValid = (payload: z.ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validPayload = payload.safeParse(req.body);

      if (!validPayload.success) {
        throw new AppError(
          400,
          validPayload.error.issues[0]?.message ?? 'invalid request data',
        );
      }

      req.body = validPayload.data;

      next();
    } catch (error: any) {
      console.log(error.message);
      next(error);
    }
  });
};

export default zodValid;
