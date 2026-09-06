import { NextFunction, Request,  Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import response from "../../utils/clientResponse";

const updateUserPhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId= req.user?.userId
  const result = await userService.updateUserPhoto(req.file?.buffer as Buffer, userId as string)
  
  response(res, {
    status: 200,
    success: true,
    message: 'image upload successfully',
    data:result
  })
})



export const userController = {
  updateUserPhoto
}