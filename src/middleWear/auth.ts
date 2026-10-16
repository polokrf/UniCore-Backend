import { NextFunction, Request, Response } from 'express';
import { Role } from '../../generated/prisma/enums';
import catchAsync from '../utils/catchAsync';
import { jwtToken } from '../utils/jwt';
import config from '../config';
import { prisma } from '../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export interface RequestUser {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

const auth = (...role: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(401, 'forbidden access');
    }

    const verifyToken: JwtPayload = jwtToken.verifyToken(
      token,
      config.access_secret,
    );

    if (!verifyToken.success) {
      throw new AppError(401, 'forbidden access');
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verifyToken.data?.email,
      },
    });
    // a valid token for a user that no longer exists is unauthenticated, not 'not found'
    if (!user) {
      throw new AppError(401, 'forbidden access');
    }

    if (!user.isActive) {
      throw new AppError(403, 'your account has blocked do not get access');
    }

    if (!user.isEmailVerified) {
      throw new AppError(403, 'forbidden access email not verified');
    }

    if (role.length > 0 && !role.includes(user.role)) {
      throw new AppError(403, 'forbidden access role not match');
    }

    req.user = {
      userId: verifyToken.data?.userId,
      name: verifyToken.data?.name,
      email: verifyToken.data?.email,
      role: verifyToken.data?.role,
    };

    next();
  });
};

export default auth;
