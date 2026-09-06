import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { courseService } from './course.service';


const createCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const result = await courseService.createCourse(req.body);

    response(res, {
      status: 201,
      success: true,
      message: 'create course successful',
      data: result,
    });
  },
);

const getAllCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await courseService.getAllCourse();

    response(res, {
      status: 200,
      success: true,
      message: 'course retrieve successfully',
      data: result,
    });
  },
);
const getSingleCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    const result = await courseService.getSingleCourse(id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'course retrieve successfully',
      data: result,
    });
  },
);

const updateCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await courseService.updateCourse(
      req.body,
      id as string
    );

    response(res, {
      status: 200,
      success: true,
      message: 'course  update successful',
      data: result,
    });
  },
);

export const courseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse
};
