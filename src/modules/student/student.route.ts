import { Router } from 'express';

import { Role } from '../../../generated/prisma/enums';

import auth from '../../middleWear/auth';
import zodValid from '../../middleWear/zodValid';
import { studentController } from './student.controller';
import { createStudentProfile, updateProfile } from './student.zod.valid';



const router = Router();

router.post(
  '/apply',
  auth(Role.USER),
  zodValid(createStudentProfile),
 studentController.createStudentProfile
  
);


router.get('/:id', auth(Role.STUDENT), studentController.getStudentProfile);
router.get('/single/:id', auth(Role.ADMIN ,Role.SUPER_ADMIN), studentController.getSingleStudentProfile);

router.patch(
'/update-won-profile',
  auth(Role.STUDENT),
  zodValid(updateProfile),
  studentController.updateStudentProfile
  
 
);



export const studentRouter = router;
