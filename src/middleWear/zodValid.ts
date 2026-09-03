import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import * as z from 'zod'

const zodValid = (payload:z.ZodObject) => {
  return catchAsync(async (req:Request, res:Response, next:NextFunction) => {
    try {
      const validPayload = payload.safeParse(req.body);

      if (!validPayload.success) {
        throw new Error(validPayload.error.issues[0]?.message);
      }

      req.body = validPayload.data;

      next()
      
    } catch (error:any) {
      console.log(error.message)
    }
    
    

  })
}


export default zodValid