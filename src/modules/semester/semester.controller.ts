import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

import response from '../../utils/clientResponse';
import { semesterService } from './semester.service';


const createSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await semesterService.createSemester(req.body);

    response(res, {
      status: 201,
      success: true,
      message: 'create semester successful',
      data: result,
    });
  },
);

const getAllSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await semesterService.getAllSemester();

    response(res, {
      status: 200,
      success: true,
      message: 'semester retrieve successfully',
      data: result,
    });
  },
);
const getSingleSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await semesterService.getSingleSemester(id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'semester retrieve successfully',
      data: result,
    });
  },
);

const updateSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await semesterService.updateSemester(req.body, id as string);

    response(res, {
      status: 200,
      success: true,
      message: 'semester  update successful',
      data: result,
    });
  },
);

export const semesterController = {
  createSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester
};
