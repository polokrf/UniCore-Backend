import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { departmentService } from "./department.service";
import response from "../../utils/clientResponse";

const createDepartment = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await departmentService.createDepartment(req.body)

  response(res, {
    status: 201,
    success: true,
    message: 'Department create success',
    data:result,
  });
})
const getAllDepartment = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await departmentService.getAllDepartment()

  response(res, {
    status: 200,
    success: true,
    message: 'Department retrieve successfully',
    data: result,
  });
})
const getSingleDepartment = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await departmentService.getSingleDepartment(req.params.id as string)

  response(res, {
    status: 200,
    success: true,
    message: 'Department retrieve successfully',
    data:result,
  });
})
const updateDepartment = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await departmentService.updateDepartment(req.body)

  response(res, {
    status: 200,
    success: true,
    message: 'Department  update successful',
    data:result,
  });
})
const deleteDepartment = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
   await departmentService.deleteDepartment(req.params.id as string)

  response(res, {
    status: 200,
    success: true,
    message: 'Department  deleted successful',
   
  });
})


export const departmentController = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment
}