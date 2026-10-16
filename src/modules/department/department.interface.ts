export interface IDepartment {
  name: string;
  code: string;
  description: string;
}


export interface IDepartmentUpdate {
  id:string,
  name?: string;
  code:string;
  description?: string;
  isActive?:boolean;
}

export interface IQuery{
  search?:string | undefined
  isActive?:string | undefined
  page?:number,
  limit?:number,
}