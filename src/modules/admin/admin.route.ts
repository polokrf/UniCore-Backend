import express from 'express';
import { adminController } from './admin.controller';
import auth from '../../middleWear/auth';
import { Role } from '../../../generated/prisma/enums';
import zodValid from '../../middleWear/zodValid';
import { updateTeacherStatusSchema } from './admin.zodValid';


const router = express.Router();

router.get(
  '/users',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllUsers,
);

router.get(
  '/teachers',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllTeacher,
);

router.get(
  '/students',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllStudent,
);

router.get(
  '/enrollments',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllEnrolment,
);

router.get(
  '/results',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllResult,
);

router.patch(
  '/teachers/:id/status',

  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(updateTeacherStatusSchema),
  adminController.updateTeacherStatus,
);

router.patch(
  '/students/:id/status',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(updateTeacherStatusSchema),
  adminController.updateStudentStatus,
);

export const adminRouter = router;
