import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import catchAsync from "../utils/catchAsync";
import { jwtToken } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

export interface RequestUser {
 userId: string;
  name: string;
  email: string;
  role:Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}


const auth = (...role: Role[]) => {
  return catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : req.headers.authorization;
    
    
    
    if (!token) {
      throw new Error('forbidden access');
    }

    
    const verifyToken: JwtPayload = jwtToken.verifyToken(token, config.access_secret)
    
   
    
    if (!verifyToken.success) {
      throw new Error('forbidden access')
    }
    
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email:verifyToken.data?.email
      }
    })

  

    if (!user.isActive) {
      throw new Error('your account has blocked do not get access')
    }

    if (!user.isEmailVerified) {
       throw new Error('forbidden access email not verified');
    }

    if (role.length > 0 && !role.includes(user.role)) {
      throw new Error('forbidden access role not match');
    }

    req.user = {
      userId: verifyToken.data?.userId,
      name: verifyToken.data?.name,
      email: verifyToken.data?.email,
      role: verifyToken.data?.role,
    };

    next()
    
  })
}

export default auth