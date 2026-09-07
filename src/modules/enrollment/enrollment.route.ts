import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { enrollNow } from './enrollment.zod.valid';
import { enrollmentController } from './enrollment.controller';

const router = Router();

router.post(
  '/enroll-now',
  auth(Role.STUDENT),
  zodValid(enrollNow),
enrollmentController.enrollNow
  
);

router.get('/', auth(Role.STUDENT),enrollmentController.getEnroll);

router.patch(
  '/cancel/:id',
  auth(Role.STUDENT),
  enrollmentController.cancelEnroll,
);



export const enrollmentRouter = router;
