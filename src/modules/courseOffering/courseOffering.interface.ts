export interface ICourseOffering {
  courseId: string;
  semesterId: string;
  section:string;
  capacity: number;
  fee:number
}

export interface IUpdateOffer{
  section?:string,
  capacity?:number,
  isActive?:boolean,
};


export interface IAssignTeacher{
  teacherId:string
}