import { prisma } from '../../lib/prisma';
import generateId from '../../utils/randomId';
import { ITeacher, ITeacherUpdate } from './teacher.interface';

const createTeacherProfile = async (payload: ITeacher,userId:string) => {
  const {  departmentId, designation, phone, qualification, specialization, joiningDate, bio } = payload
  
  const isExitApply = await prisma.teacherProfile.findUnique({
    where: {
      userId:userId
    }
  })

  if (isExitApply) {
    throw new Error('you already apply for teacher role plz await for approved')
  }

  const applyTeacher = await prisma.teacherProfile.create({
    data: {
      userId,
      departmentId,
      designation,
      phone,
      qualification,
      specialization,
      joiningDate,
      bio
    }
  })

  return applyTeacher


};



const getAllTeacherProfile = async () => {
  const result = await prisma.teacherProfile.findMany({
    where: {
      status: 'APPROVED',
      isActive:true
    },
  });

  return result;
};

const getSingleTeacherProfile = async (id: string) => {
  const result = await prisma.teacherProfile.findUnique({
    where: {
      id,
      status: 'APPROVED',
      isActive:true
    },
  });

  return result;
};

const updateTeacherProfile = async (payload:ITeacherUpdate,userId:string) => {
  const result = await prisma.teacherProfile.update({
    where: {
      userId:userId
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
