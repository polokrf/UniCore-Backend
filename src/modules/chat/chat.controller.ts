import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { chatService } from "./chat.service";
import response from "../../utils/clientResponse";

const sendMessage = catchAsync(async(req:Request,res:Response)=>{
  const result = await chatService.sendMessage(req.body)

  response(res,{
    status:200,
    success:true,
    message:'ai give ans successfully',
    data:result
  })
})


export const chatController ={
  sendMessage
}