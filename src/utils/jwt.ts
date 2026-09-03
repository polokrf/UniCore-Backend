import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const singToken = (payload: JwtPayload, secret: string, options:SignOptions) => {
  try {
    const token =jwt.sign(payload, secret, options)
    return token
  } catch (error) {
    console.log(error)
    
  }
}


export const jwtToken={
 singToken
} 