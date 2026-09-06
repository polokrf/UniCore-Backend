import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { createTeacher, updateTeacher } from './teacher.zod.valid';
import { teacherController } from './teacher.controller';


const router = Router();

router.post(
  '/apply',
  auth(Role.USER),
  zodValid(createTeacher),
  teacherController.createTeacherProfile
);

router.get('/', auth(),teacherController.getAllTeacherProfile);
router.get('/:id', auth(), teacherController.getSingleTeacherProfile);

router.patch(
  '/update-won-profile',
  auth(Role.TEACHER),
  zodValid(updateTeacher),
  teacherController.updateTeacherProfile
);



export const teacherRouter = router;
