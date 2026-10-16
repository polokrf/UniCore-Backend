import { NextFunction, Request, Response } from 'express';
import config from '../config';
import { AppError } from '../utils/AppError';

// Turn any error into { success:false, statusCode, message }.
//   AppError                      -> its own status + message (expected failures)
//   Prisma known errors           -> 404 / 409 (record missing / unique / relation)
//   Prisma validation, bad JSON   -> 400
//   JWT errors                    -> 401
//   anything else                 -> 500 (message hidden in production)
const resolve = (err: any): { status: number; message: string } => {
  if (err instanceof AppError) {
    return { status: err.statusCode, message: err.message };
  }

  if (err?.name === 'PrismaClientKnownRequestError') {
    switch (err.code) {
      case 'P2025': // record required but not found
        return { status: 404, message: 'record not found' };
      case 'P2002': // unique constraint
        return { status: 409, message: 'this record already exists' };
      case 'P2003': // foreign key: bad reference, or still referenced
        return {
          status: 409,
          message:
            'this record is linked to other records, or points to one that does not exist',
        };
      default:
        break;
    }
  }
  if (err?.name === 'PrismaClientValidationError') {
    return { status: 400, message: 'invalid request data' };
  }

  if (
    ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(
      err?.name,
    )
  ) {
    return { status: 401, message: 'forbidden access' };
  }

  // body-parser & friends (e.g. malformed JSON) expose a 4xx status
  const http = err?.statusCode ?? err?.status;
  if (err?.expose && Number.isInteger(http) && http >= 400 && http < 500) {
    return { status: http, message: err.message };
  }

  const production = config.mode === 'production';
  return {
    status: 500,
    message: production
      ? 'internal server error'
      : err?.message || 'internal server error',
  };
};

export const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status, message } = resolve(err);
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    statusCode: status,
    name: err?.name,
    message,
    // stack traces only outside production
    ...(config.mode === 'production' ? {} : { error: err?.stack }),
  });
};
