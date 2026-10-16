import express from 'express'
import { userController } from './user.controller'
import upload from '../../lib/multer'
import auth from '../../middleWear/auth'
import { Role } from '../../../generated/prisma/enums'



const router = express.Router()


router.patch('/update-profile-photo',auth(Role.ADMIN,Role.DEPARTMENT_HEAD,Role.SUPER_ADMIN,Role.TEACHER,Role.STUDENT,Role.USER), upload.single('image'),userController.updateUserPhoto)
router.patch('/update-status/:id',auth(Role.ADMIN,Role.SUPER_ADMIN),userController.updateUserStatus)

export const userRouter = router