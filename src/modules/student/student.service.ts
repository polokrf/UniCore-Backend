import { prisma } from '../../lib/prisma';
import { IStudent, IUpdateProfile } from './student.interface';

const createStudentProfile = async (payload:IStudent,userId:string) => {
  const {
  departmentId,
  batch,
  phone,
  dateOfBirth,
  gender,
  address
  } = payload;

  const isExitApply = await prisma.studentProfile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (isExitApply) {
    throw new Error(
      'you already apply for Student role plz await for approved',
    );
  }

  const applyStudent = await prisma.studentProfile.create({
    data: {
      userId,
      departmentId,
      phone,
      batch,
      dateOfBirth,
      gender,
     address
    },
  });

  return applyStudent;
};


const getStudentProfile = async (id: string) => {
  const result = await prisma.studentProfile.findUnique({
    where: {
      userId:id,
      status: 'APPROVED',
      isActive: true,
    },
  });

  return result;
};

const updateStudentProfile = async (payload:IUpdateProfile, userId: string) => {
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
  updateStudentProfile
};
