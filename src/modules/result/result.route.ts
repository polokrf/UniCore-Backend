import express from 'express'
import auth from '../../middleWear/auth'
import { Role } from '../../../generated/prisma/enums'
import zodValid from '../../middleWear/zodValid'
import { createResult } from './result.zodValid'
import { resultController } from './result.controller'

const router = express.Router()


router.post('/', auth(Role.ADMIN, Role.SUPER_ADMIN), zodValid(createResult), resultController.createResult)

router.get('/',auth(Role.ADMIN,Role.SUPER_ADMIN,Role.STUDENT),resultController.getResult)
router.get('/:id',auth(Role.ADMIN,Role.SUPER_ADMIN,Role.STUDENT),resultController.getSingleResult)



export const resultRouter = router 