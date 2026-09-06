export interface ITeacher {
  
  departmentId:string;
  designation:string;
  phone?:string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  bio?: string;
}


export interface ITeacherUpdate {
  phone?:string;
  qualification?: string;
  specialization?: string;
  bio?: string;
}