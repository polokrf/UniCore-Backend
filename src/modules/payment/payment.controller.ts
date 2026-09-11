import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { getGrantToken } from "../../lib/bkash";
import catchAsync from "../../utils/catchAsync";
import response from "../../utils/clientResponse";
import { paymentService } from "./payment.service";

const checkoutPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user=req.user!
  const paymentInit = await paymentService.checkoutPayment(
    req.body.enrollmentId,user
  );

  // console.log(paymentInit)

  response(res, {
    status: 201,
    success: true,
    message: 'result success',
    data:paymentInit
  })
})


const checkoutCallBack = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { redirectUrl } = await paymentService.checkoutCallBack(req.query)
  
  res.redirect(redirectUrl)
})


export const paymentController = {
  checkoutPayment,
  checkoutCallBack
}