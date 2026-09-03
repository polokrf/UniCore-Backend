import { NextFunction, Request, RequestHandler, Response } from "express"

const catchAsync = (fu:RequestHandler) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    try {
      await fu(req,res,next)
    } catch (error) {
      next(error)
    }
  }
}


export default catchAsync