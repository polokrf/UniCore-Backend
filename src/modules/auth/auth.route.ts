import express from 'express'
import zodValid from '../../middleWear/zodValid';
import { authController } from './auth.controller';
import { loginPayload, registerPayload, verifyEmailPayload } from './auth.zodValid';
import auth from '../../middleWear/auth';
const router = express.Router()



router.post('/register', zodValid(registerPayload), authController.userRegister)
router.post('/email-verify', zodValid(verifyEmailPayload), authController.registerEmailVerify)
router.post('/login',zodValid(loginPayload),authController.userLogin)
router.post('/logout', authController.logOut)


router.get('/profile',auth(),authController.myProfile)



export const authRouter = router;

