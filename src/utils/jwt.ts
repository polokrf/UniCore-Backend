import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { success } from "zod";

const singToken = (payload: JwtPayload, secret: string, options:SignOptions) => {
  try {
    const token =jwt.sign(payload, secret, options)
    return token
  } catch (error) {
    console.log(error)
    
  }
}

const verifyToken = (token:string,secret:string) => {
  try {
    const verify = jwt.verify(token, secret)
    
    return {
      success: true,
      status:200,
      data:verify
    }

  } catch (error) {
    return {
      success: false,
      status:403
    }
  }
}


export const jwtToken={
  singToken,
  verifyToken
} 