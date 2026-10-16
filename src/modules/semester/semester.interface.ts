export interface ISemester {
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}
export interface ISemesterUpdate {
  name?: string;
  year?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface IQuery {
  search?: string | undefined;
  isActive?: string | undefined;
  page?: number;
  limit?: number;
}