import express from 'express';
import auth from '../../middleWear/auth';
import { Role } from '../../../generated/prisma/enums';
import zodValid from '../../middleWear/zodValid';
import { createResult, updateResult } from './result.zodValid';
import { resultController } from './result.controller';

const router = express.Router();

router.post(
  '/',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(createResult),
  resultController.createResult,
);

router.get('/', auth(Role.STUDENT), resultController.getResult);
router.patch(
  '/:id',
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValid(updateResult),
  resultController.updateResult,
);
router.get('/:id', auth(Role.STUDENT), resultController.getSingleResult);

export const resultRouter = router;
