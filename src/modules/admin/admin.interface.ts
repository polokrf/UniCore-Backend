
import { EnrollmentStatus, Grade, Role, StudentStatus, TeacherStatus } from "../../../generated/prisma/enums";

export  interface IUser{
  search?: string;
  role?: Role;
  isActive?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface ITeacher {
  search?: string;
  status?: TeacherStatus;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface IStudent {
  search?: string;
  status?: StudentStatus;
  batch?: number;
  semester?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface IEnrollment {
  search?: string;
  status?: EnrollmentStatus;
  
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface IResult {
  search?: string;
  published?: string;
  sortBy?: 'createdAt' | 'marks' | 'gradePoint';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}