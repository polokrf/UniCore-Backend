export interface IStudent {
  departmentId: string;
  batch: number;
  phone: string;
  dateOfBirth: string;
  gender:string;
  address:string;
}


export interface IUpdateProfile{
  phone?:string,
  address?: string,
}