import express from 'express'
import { paymentController } from './payment.controller';
import zodValid from '../../middleWear/zodValid';
import { createPayment } from './payment.zodValid';
import auth from '../../middleWear/auth';
import { Role } from '../../../generated/prisma/enums';
const router = express.Router()


router.post('/checkout/create',auth(Role.STUDENT),zodValid(createPayment),paymentController.checkoutPayment);
router.get('/checkout/callback',paymentController.checkoutCallBack);

export const paymentRouter = router