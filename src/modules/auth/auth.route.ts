import express from 'express'
import zodValid from '../../middleWear/zodValid';
import { authController } from './auth.controller';

const router = express.Router()

router.post('/register', zodValid, authController.userRegister)
router.post('/email-verify', zodValid, authController.registerEmailVerify)
router.post('/login',zodValid,authController.userLogin)



export const authRouter = router;

