import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { courseController } from './course.controller';
import { crateCourse } from './course.zod.valid';

const router = Router();

router.post(
  '/crate',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(crateCourse),
  courseController.createCourse
  
);

router.get('/', auth(), courseController.getAllCourse);
router.get('/:id', auth(), courseController.getSingleCourse);


router.patch(
  '/:id',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  courseController.updateCourse
  
);

export const CourseRouter = router;
