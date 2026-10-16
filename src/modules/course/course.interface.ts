export interface ICourse {
  departmentId: string;
  code: string;
  title: string;
  description: string;
  credit: number;
}
export interface ICourseUpdate {
  code?: string;
  title?: string;
  description?: string;
  credit?: number;
}

export interface IQuery {
  search?: string | undefined;
  isActive?: string | undefined;
  page?: number;
  limit?: number;
}