import { prisma } from '../../lib/prisma';
import { IStudent, IUpdateProfile } from './student.interface';
import { AppError } from '../../utils/AppError';

const createStudentProfile = async (payload: IStudent, userId: string) => {
  const { departmentId, batch, phone, dateOfBirth, gender, address } = payload;

  const isExitApply = await prisma.studentProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isExitApply) {
    // a rejected applicant may apply again: reset the same profile to PENDING
    if (isExitApply.status === 'REJECTED') {
      const isOtherApply = await prisma.teacherProfile.findUnique({
        where: { userId },
      });
      if (isOtherApply) {
        throw new AppError(409, 'you already apply for Teacher role');
      }
      return prisma.studentProfile.update({
        where: { userId },
        data: {
          departmentId,
          phone,
          batch,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address,
          status: 'PENDING',
        },
      });
    }
    throw new AppError(
      409,
      'you already apply for Student role plz await for approved',
    );
  }

  const isExitApplyTeacher = await prisma.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isExitApplyTeacher) {
    throw new AppError(409, 'you already apply for Teacher role');
  }

  const applyStudent = await prisma.studentProfile.create({
    data: {
      userId,
      departmentId,
      phone,
      batch,
      dateOfBirth: new Date(dateOfBirth),

      gender,
      address,
    },
  });

  return applyStudent;
};

const getStudentProfile = async (id: string) => {
  const result = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      userId: id,
      status: 'APPROVED',
      isActive: true,
    },
  });

  return result;
};

const getSingleStudentProfile = async (id: string) => {
  const result = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      id: id,
      isActive: true,
    },
  });

  return result;
};

const updateStudentProfile = async (
  payload: IUpdateProfile,
  userId: string,
) => {
  const result = await prisma.studentProfile.update({
    where: {
      userId: userId,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

export const studentService = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getSingleStudentProfile,
};
