export interface ICourse {
  departmentId: string;
  code:string;
  title: string;
  description?: string;
  credit:number;
}
export interface ICourseUpdate {
  code?:string;
  title?: string;
  description?: string;
  credit?:number;
}