import { prisma } from '../../lib/prisma';
import { ICourse, ICourseUpdate, IQuery } from './course.interface';
import { AppError } from '../../utils/AppError';
import { Prisma } from '../../../generated/prisma/browser';
import { is } from 'zod/v4/locales';

const createCourse = async (payload: ICourse) => {
  const { departmentId, code, title, description, credit } = payload;

  const isExitCourse = await prisma.course.findUnique({
    where: {
      code: code,
    },
  });

  if (isExitCourse) {
    throw new AppError(409, 'this course already created');
  }

  const result = await prisma.course.create({
    data: {
      departmentId,
      code,
      title,
      description,
      credit,
    },
  });

  return result;
};

const getAllCourse = async (query:IQuery) => {
  const { search, isActive, page = 1, limit = 10 } = query;
  const active = isActive === 'ACTIVE' ? true : isActive === 'BLOCKED' ? false : undefined;

  const limitNumber = Number(limit);
  const numberPage = Number(page);
  const skip = (numberPage - 1) * limitNumber;


 const where : Prisma.CourseWhereInput={
   ...(active !== undefined && {
    isActive:active
   }),
   ...(search && {
    title:{
      contains:search,
      mode:'insensitive'
    }
   })
 }

  const result = await prisma.course.findMany({
    where,
    skip,
    take:limitNumber
  });

 const total = await prisma.course.count({
  where
 })

   return {
     data: result,
     meta: {
       page: numberPage,
       limit: limitNumber,
       total,
       totalPage: Math.ceil(total / limitNumber),
     },
   };
};

const getSingleCourse = async (id: string) => {
  const result = await prisma.course.findUniqueOrThrow({
    where: {
      id: id,
      isActive: true,
    },
  });

  return result;
};

const updateCourse = async (payload: ICourseUpdate, id: string) => {
  const result = await prisma.course.update({
    where: {
      id: id,
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
  updateCourse,
};
