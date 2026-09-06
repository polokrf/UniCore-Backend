export interface ISemester {
  name:string;
  year:number;
  startDate:string;
  endDate: string;
}
export interface ISemesterUpdate {
  name?: string;
  year?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}