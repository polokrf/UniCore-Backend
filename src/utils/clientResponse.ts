import { Response } from "express"


interface IResponse {
  status: number,
  success: boolean,
  message: string,
  data?: any
  meta?: any
}

const response = (res:Response, data:IResponse) => {
  res.json({
    ...data
    
  })
}

export default response