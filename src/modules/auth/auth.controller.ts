import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import response from "../../utils/clientResponse";
import config from "../../config";

const userRegister = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
   await authService.userRegister(req.body)

  response(res, {
    status: 200,
    success: true,
    message: 'Plz check your email  send a verify otp',
    data: null,
  });
})

const registerEmailVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, accessToken, refreshToken } = await authService.registerEmailVerify(req.body)

  // console.log(accessToken,refreshToken,'accessToken','refreshToken')
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 1,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 7,
  });
  
  response(res, {
    status: 200,
    success: true,
    message: 'user register successful',
    data: {
      user,
      accessToken,
      refreshToken
    }
  });

});


const userLogin = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { accessToken, refreshToken } = await authService.userLogin(req.body)

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 1,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 7,
  });

  response(res, {
    status: 200,
    success: true,
    message: 'user login successful',
    data: {
      accessToken,
      refreshToken,
    },
  });
  
})


const logOut = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.mode === 'development' ? false : true,
    sameSite: config.mode === 'development' ? 'lax' : 'none',
  });

  response(res, {
    status: 200,
    success: true,
    message: 'LogOut successful',
   
  });


})


const myProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId
  const profile = await authService.myProfile(userId as string)

   response(res, {
     status: 200,
     success: true,
     message: 'profile  retrieve successfully',
     data:profile
   });
  
})


export const authController = {
  userRegister,
  userLogin,
  logOut,
  myProfile,
  registerEmailVerify
}


