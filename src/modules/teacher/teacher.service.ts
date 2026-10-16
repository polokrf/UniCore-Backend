import { prisma } from '../../lib/prisma';
import generateId from '../../utils/randomId';
import { ITeacher, ITeacherUpdate } from './teacher.interface';
import { AppError } from '../../utils/AppError';

const createTeacherProfile = async (payload: ITeacher, userId: string) => {
  const {
    departmentId,
    designation,
    phone,
    qualification,
    specialization,
    bio,
  } = payload;

  const isExitApply = await prisma.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isExitApply) {
    // a rejected applicant may apply again: reset the same profile to PENDING
    if (isExitApply.status === 'REJECTED') {
      const isOtherApply = await prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (isOtherApply) {
        throw new AppError(409, 'you already apply for Student role');
      }
      return prisma.teacherProfile.update({
        where: { userId },
        data: {
          departmentId,
          designation,
          phone,
          qualification,
          specialization,
          bio,
          status: 'PENDING',
          rejectionReason: null,
        },
      });
    }
    throw new AppError(
      409,
      'you already apply for teacher role plz await for approved',
    );
  }

  const isExitApplyStudent = await prisma.studentProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isExitApplyStudent) {
    throw new AppError(409, 'you already apply for Student role');
  }

  const applyTeacher = await prisma.teacherProfile.create({
    data: {
      userId,
      departmentId,
      designation,
      phone,
      qualification,
      specialization,

      bio,
    },
  });

  return applyTeacher;
};

const getAllTeacherProfile = async () => {
  const result = await prisma.teacherProfile.findMany({
    where: {
      status: 'APPROVED',
      isActive: true,
    },
  });

  return result;
};

const getSingleTeacherProfile = async (id: string) => {
  const result = await prisma.teacherProfile.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
    include:{
      user:true
    }
  });

  return result;
};

const updateTeacherProfile = async (
  payload: ITeacherUpdate,
  userId: string,
) => {
  const result = await prisma.teacherProfile.update({
    where: {
      userId: userId,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

export const teacherService = {
  createTeacherProfile,
  getAllTeacherProfile,
  getSingleTeacherProfile,
  updateTeacherProfile,
};
