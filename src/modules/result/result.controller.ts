import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { resultService } from "./result.service";
import response from "../../utils/clientResponse";
import { RequestUser } from "../../middleWear/auth";

const createResult = catchAsync(async (req:Request, res:Response) => {
  const result = await resultService.createResult(req.body);

  response(res, {
    status: 201,
    success: true,
    message: 'result create successfully',
    data: result,
  });
})
const getResult = catchAsync(async (req: Request, res: Response) => {
  const id =req.user?.userId
   const result = await resultService.getResult(id as string);

   response(res, {
     status: 200,
     success: true,
     message: 'result get successfully',
     data: result,
   });
})
const getSingleResult = catchAsync(async (req: Request, res: Response) => {
 const id = req.params.id
  
   const result = await resultService.getSingleResult( id as string ,req.user as RequestUser);

   response(res, {
     status: 200,
     success: true,
     message: 'result get successfully',
     data: result,
   });
})

export const resultController = {
  createResult,
  getResult,
  getSingleResult
}