import { prisma } from '../../lib/prisma';
import { ICourse, ICourseUpdate } from './course.interface';


const createCourse = async (payload:ICourse) => {
  const {
  departmentId,
  code,
  title,
  description,
  credit,
  } = payload;

  const isExitCourse = await prisma.course.findUnique({
    where: {
      code:code
    },
  });

  if (isExitCourse) {
    throw new Error(
      'this course already created',
    );
  }

  const result = await prisma.course.create({
    data: {
      departmentId,
      code,
      title,
      description,
      credit
    },
  });

  return result;
};


const getAllCourse = async () => {
  const result = await prisma.course.findMany({
    where: {
     isActive: true,
    },
  });

  return result;
};

const getSingleCourse = async (id: string) => {
  const result = await prisma.course.findUnique({
    where: {
     id:id,
     isActive: true,
    },
  });

  return result;
};

const updateCourse = async (payload:ICourseUpdate, id:string) => {
  const result = await prisma.course.update({
    where: {
      id:id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

export const courseService = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse
};
