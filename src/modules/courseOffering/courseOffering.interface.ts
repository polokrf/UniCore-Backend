export interface ICourseOffering {
  courseId: string;
  semesterId: string;
  section: string;
  capacity: number;
  fee: number;
  teacherId?: string;
}

export interface IUpdateOffer {
  section?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface IAssignTeacher {
  teacherId: string;
}
