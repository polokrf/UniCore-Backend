import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { teacherService } from './teacher.service';

const createTeacherProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId=req.user?.userId
    const result = await teacherService.createTeacherProfile(req.body,userId as string);

    response(res, {
      status: 201,
      success: true,
      message: 'Applying success for Teacher',
      data: result,
    });
  },
);
const getAllTeacherProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await teacherService.getAllTeacherProfile();

    response(res, {
      status: 200,
      success: true,
      message: 'Teacher profile retrieve successfully',
      data: result,
    });
  },
);
const getSingleTeacherProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await teacherService.getSingleTeacherProfile(
      req.params.id as string,
    );

    response(res, {
      status: 200,
      success: true,
      message: 'Teacher profile retrieve successfully',
      data: result,
    });
  },
);
const updateTeacherProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.userId
    const result = await teacherService.updateTeacherProfile(req.body,userId as string);

    response(res, {
      status: 200,
      success: true,
      message: 'Teacher Profile  update successful',
      data: result,
    });
  },
);


export const teacherController = {
  createTeacherProfile,
  getAllTeacherProfile,
  getSingleTeacherProfile,
  updateTeacherProfile,
 
};
