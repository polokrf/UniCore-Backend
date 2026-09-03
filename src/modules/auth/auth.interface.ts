export interface IRegister{
  firstName: string,
  email: string,
  password:string
}

export interface IVerifyEmail{
  email: string,
  otp:string
}

export interface ILogin{
  email: string,
  password:string
}