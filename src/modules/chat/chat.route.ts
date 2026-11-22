import { Router } from "express";
import zodValid from "../../middleWear/zodValid";
import { SendChatMessageZodSchema } from "./chat.validation";
import { chatController } from "./chat.controller";

const router = Router()


router.post('/',zodValid(SendChatMessageZodSchema), chatController.sendMessage)


export const chatRoutes = router