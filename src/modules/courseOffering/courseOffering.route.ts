import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { createOffering, updateOffer } from './courseOffering.zod.valid';
import { courseOfferingController } from './courseOffering.controller';


const router = Router();

router.post(
  '/create',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(createOffering),
  courseOfferingController.createCourseOffering
  
  
);

router.get('/', auth(), courseOfferingController.getAllCourseOffering);
router.get('/:id', auth(),courseOfferingController.getSingleCourseOffering);

router.patch(
  '/:id',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(updateOffer),
  courseOfferingController.updateCourseOffering

  
);

router.patch('/assign-teacher/:id',auth(Role.SUPER_ADMIN,Role.ADMIN))

export const courseOfferingRouter = router;
