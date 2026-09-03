import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";
import response from "../../utils/clientResponse";

const userRegister = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  await authService.userRegister(req.body)

  response(
    res, {
      status: 200,
      success: true,
      message:'Sent To OTP YOUR EMAIL'
    }
  )
})
const registerEmailVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { user, accessToken, refreshToken } = await authService.registerEmailVerify(req.body)

  // console.log(accessToken,refreshToken,'accessToken','refreshToken')
  
  res.cookie('accessToken', accessToken, {
     
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 1,
      
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
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
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 1,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
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
    secure: false,
    sameSite: 'none',
  
  })

  res.clearCookie('refreshToken', {
    
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  
  })

  response(res, {
    status: 200,
    success: true,
    message: 'LogOut successful',
   
  });


})


export const authController = {
  userRegister,
  registerEmailVerify,
  userLogin,
  logOut
}