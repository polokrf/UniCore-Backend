import { prisma } from '../../lib/prisma';
import { ISemester, ISemesterUpdate } from './semester.interface';

const createSemester = async (payload:ISemester) => {
  const { name,year,startDate,endDate } = payload;

  const isExitSemester = await prisma.semester.findUnique({
    where: {
      name_year: {
        name,
        year
     }
    },
  });

  if (isExitSemester) {
    throw new Error('this Semester already exists');
  }

  const result = await prisma.semester.create({
    data: {
      name,
      year,
      startDate,
      endDate

    },
  });

  return result;
};



const getAllSemester = async () => {
  const result = await prisma.semester.findMany({
    where: {
      isActive: true,
    },
  });

  return result;
};

const getSingleSemester = async (id: string) => {
  const result = await prisma.semester.findUnique({
    where: {
      id: id,
      isActive: true,
    },
  });

  return result;
};

const updateSemester = async (payload:ISemesterUpdate, id: string) => {
  const result = await prisma.semester.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

export const semesterService = {
  createSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester
};
