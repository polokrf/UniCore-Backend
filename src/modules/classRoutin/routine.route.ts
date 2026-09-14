import express from 'express'
import zodValid from '../../middleWear/zodValid'
import { createClassRoutine, updateClassRoutine } from './routine.zodValid'
import auth from '../../middleWear/auth'
import { Role } from '../../../generated/prisma/enums'
import { routineController } from './routine.controller'

const router = express.Router()

router.post('/', auth(Role.ADMIN, Role.SUPER_ADMIN), zodValid(createClassRoutine), routineController.createClassRoutine)

router.get(
  '/',
  auth(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.DEPARTMENT_HEAD,
    Role.TEACHER,
    Role.STUDENT,
  ),
  routineController.getAllClassRoutines,
);

router.get(
  '/',
  auth(
    Role.ADMIN,
    Role.SUPER_ADMIN,
    Role.DEPARTMENT_HEAD,
    Role.TEACHER,
    Role.STUDENT,
  ),
 routineController.getSingleClassRoutines
);


router.patch('/:id',auth(Role.ADMIN,Role.SUPER_ADMIN),zodValid(updateClassRoutine),routineController.updateRoutine)

router.delete('/:id',auth(Role.ADMIN,Role.SUPER_ADMIN) ,routineController.deleteClassRoutine)

export const routineRouter =router 