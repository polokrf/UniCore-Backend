import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { studentService } from './student.service';

const createStudentProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId
    const result = await studentService.createStudentProfile(req.body,userId as string);

    response(res, {
      status: 201,
      success: true,
      message: 'Applying success for Student',
      data: result,
    });
  },
);

const getStudentProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId
    const result = await studentService.getStudentProfile(
     userId as string,
    );

    response(res, {
      status: 200,
      success: true,
      message: 'Student profile retrieve successfully',
      data: result,
    });
  },
);

const updateStudentProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await studentService.updateStudentProfile(
      req.body,
      userId as string,
    );

    response(res, {
      status: 200,
      success: true,
      message: 'Teacher Profile  update successful',
      data: result,
    });
  },
);

export const studentController = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile
};
