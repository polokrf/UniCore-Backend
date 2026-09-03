import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

const userRegister = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  
})
const registerEmailVerify = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  

})
const userLogin = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  
})



export const authController = {
  userRegister,
  registerEmailVerify,
  userLogin
}