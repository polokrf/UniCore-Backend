import catchAsync from '../../utils/catchAsync';
import response from '../../utils/clientResponse';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req, res) => {
  const result = await adminService.getAllUsers();

  response(res, {
    status: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getAllTeacher = catchAsync(async (req, res) => {
  const result = await adminService.getAllTeacher();

  response(res, {
    status: 200,
    success: true,
    message: 'Teachers retrieved successfully',
    data: result,
  });
});

const getAllStudent = catchAsync(async (req, res) => {
  const result = await adminService.getAllStudent();

  response(res, {
    status: 200,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  });
});

const getAllEnrolment = catchAsync(async (req, res) => {
  const result = await adminService.getAllEnrolment();

  response(res, {
    status: 200,
    success: true,
    message: 'Enrollments retrieved successfully',
    data: result,
  });
});

const getAllResult = catchAsync(async (req, res) => {
  const result = await adminService.getAllResult();

  response(res, {
    status: 200,
    success: true,
    message: 'Results retrieved successfully',
    data: result,
  });
});

const updateTeacherStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminService.updateTeacherStatus(
    id as string,
    req.body.status,
  );

  response(res, {
    status: 200,
    success: true,
    message: 'Teacher status updated successfully',
    data: result,
  });
});

const updateStudentStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminService.updateStudentStatus(
    id as string,
    req.body.status,
  );

  response(res, {
    status: 200,
    success: true,
    message: 'Student status updated successfully',
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  getAllTeacher,
  getAllStudent,
  getAllEnrolment,
  getAllResult,
  updateTeacherStatus,
  updateStudentStatus,
};