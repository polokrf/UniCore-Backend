import express from 'express'
import { userController } from './user.controller'
import upload from '../../lib/multer'
import auth from '../../middleWear/auth'
import { Role } from '../../../generated/prisma/enums'



const router = express.Router()


router.patch('/update-profile-photo',auth(Role.ADMIN,Role.DEPARTMENT_HEAD,Role.SUPER_ADMIN,Role.TEACHER,Role.STUDENT,Role.USER), upload.single('image'),userController.updateUserPhoto)

export const userRouter = router