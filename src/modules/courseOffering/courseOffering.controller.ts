import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { courseOfferingService } from './courseOffering.service';


const createCourseOffering = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await courseOfferingService.createCourseOffering(req.body);

    response(res, {
      status: 201,
      success: true,
      message: 'create courseOffering successful',
      data: result,
    });
  },
);

const getAllCourseOffering = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await courseOfferingService.getAllCourseOffering();

    response(res, {
      status: 200,
      success: true,
      message: 'Course Offer retrieve successfully',
      data: result,
    });
  },
);
const getSingleCourseOffering = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await courseOfferingService.getSingleCourseOffering(id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'course offering retrieve successfully',
      data: result,
    });
  },
);

const updateCourseOffering = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await courseOfferingService.updateCourseOffering(req.body, id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'course offering  update successful',
      data: result,
    });
  },
);
const assignCourseOfferingTeacher = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await courseOfferingService.updateCourseOffering(req.body, id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'course offering  update successful',
      data: result,
    });
  },
);


export const courseOfferingController = {
  createCourseOffering,
  getAllCourseOffering,
  getSingleCourseOffering,
  updateCourseOffering,
};
