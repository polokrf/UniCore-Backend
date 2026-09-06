import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';
import { departmentController } from './department.controller';
import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { createDepartment, updateDepartment } from './zodValidDeparment';

const router = Router();

router.post(
  '/',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(createDepartment),
  departmentController.createDepartment,
);

router.get('/', auth(), departmentController.getAllDepartment)
router.get('/:id', auth(), departmentController.getSingleDepartment)
router.patch('/update', auth(Role.ADMIN, Role.SUPER_ADMIN), zodValid(updateDepartment), departmentController.updateDepartment);

router.delete('/:id', auth(Role.ADMIN, Role.SUPER_ADMIN),departmentController.deleteDepartment);

export const departmentRouter = router;
