import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { routineService } from "./routine.service";
import response from "../../utils/clientResponse";

const createClassRoutine = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const result = await routineService.createClassRoutine(req.body)
  
  response(res, {
    status: 201,
    success: true,
    message: 'Class Routine create successfully',
    data:result
  })
})



const getAllClassRoutines = catchAsync(async (req:Request, res:Response) => {
  const result = await routineService.getAllClassRoutine(req.user!);

  response(res, {
    status: 200,
    success: true,
    message: 'Class routines retrieved successfully',
    data: result,
  });
});

const updateRoutine = catchAsync(async (req:Request, res:Response) => {
  const id = req.params.id
  const result = await routineService.updateRoutine(id as string,req.body);

  response(res, {
    status: 200,
    success: true,
    message: 'Class routines update successfully',
    data: result,
  });
});


const deleteClassRoutine = catchAsync(async (req:Request, res:Response) => {
  const id = req.params.id;
 await routineService.deleteClassRoutine(id as string);

  response(res, {
    status: 200,
    success: true,
    message: 'Class routines deleted successfully',
    data: null,
  });
})




export const routineController = {
  createClassRoutine,
  getAllClassRoutines,
  updateRoutine,
  deleteClassRoutine
}