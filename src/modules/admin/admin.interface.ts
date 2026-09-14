
import { EnrollmentStatus, Grade, Role, StudentStatus, TeacherStatus } from "../../../generated/prisma/enums";

export  interface IUser{
  search?: string;
  role?: Role;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface ITeacher {
  search?: string;
  status?: TeacherStatus;
  departmentId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface IStudent {
  search?: string;
  status?: StudentStatus;
  departmentId?: string;
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
  courseOfferingId?: string;
  semesterId?: string;
  courseId?: string;
  studentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface IResult {
  search?: string;
  grade?: Grade;
  semesterId?: string;
  courseId?: string;
  departmentId?: string;
  published?: boolean;
  sortBy?: 'createdAt' | 'marks' | 'gradePoint';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}