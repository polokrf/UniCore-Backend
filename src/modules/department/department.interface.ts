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