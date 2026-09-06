import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { semesterController } from './semester.controller';
import { createSemester, updateSemester } from './semsster.zod.valid';


const router = Router();

router.post(
  '/crate',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(createSemester),
  semesterController.createSemester
);

router.get('/', auth(), semesterController.getAllSemester);
router.get('/:id', auth(),semesterController.getSingleSemester);

router.patch(
  '/:id',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(updateSemester),
  semesterController.updateSemester,
);

export const semesterRouter = router;
