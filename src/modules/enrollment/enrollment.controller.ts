import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { enrollmentService } from './enrollment.service';

const enrollNow = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

   const userId = req.user?.userId;
    const result = await enrollmentService.enrollNow(req.body,userId as string);

    response(res, {
      status: 201,
      success: true,
      message: 'Enrollment successful',
      data: result,
    });
  },
);

const getEnroll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   const  userId = req.user?.userId
    const result = await enrollmentService.getEnroll(userId as string);

    response(res, {
      status: 200,
      success: true,
      message: 'My Enrollment retrieve successfully',
      data: result,
    });
  },
);


const cancelEnroll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user?.userId
    const result = await enrollmentService.cancelEnroll(
      id as string,
      userId as string
    );

    response(res, {
      status: 200,
      success: true,
      message: 'enrollment cancel successful',
      data: result,
    });
  },
);


export const enrollmentController = {
  enrollNow,
  getEnroll,
  cancelEnroll
};
