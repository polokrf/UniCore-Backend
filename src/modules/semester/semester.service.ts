import { prisma } from '../../lib/prisma';
import { IQuery, ISemester, ISemesterUpdate } from './semester.interface';
import { AppError } from '../../utils/AppError';
import { Prisma } from '../../../generated/prisma/browser';


const createSemester = async (payload: ISemester) => {
  const { name, year, startDate, endDate } = payload;

  const isExitSemester = await prisma.semester.findUnique({
    where: {
      name_year: {
        name,
        year,
      },
    },
  });

  if (isExitSemester) {
    throw new AppError(409, 'this Semester already exists');
  }

  const result = await prisma.semester.create({
    data: {
      name,
      year,
      startDate,
      endDate,
    },
  });

  return result;
};

const getAllSemester = async (query:IQuery) => {

  const {search,isActive,page=1,limit=10}=query

  const active = isActive === 'ACTIVE' ? true :isActive === 'BLOCKED' ? false : undefined
  const limitNumber = Number(limit)
  const pageNumber = Number(page)
  const skip = (pageNumber -1) * limitNumber

  const where: Prisma.SemesterWhereInput = {
    ...(active !== undefined && {
      isActive: active,
    }),

    ...(search && {
    OR:[
    {name: {
        contains: search,
        mode: 'insensitive',
     }},

     { year:{
        equals:Number(search)
        
      }
    }
    ]
    })
    
  };


  const result = await prisma.semester.findMany({
    where,
    skip,
    take: limitNumber
  });

  const total =await prisma.semester.count({
  where
  }) 



  return {
    data: result,
    meta:{
      skip:pageNumber,
      limit:limitNumber,
      total,
      totalPage : Math.ceil(total | limitNumber)

    }
  };
};

const getSingleSemester = async (id: string) => {
  const result = await prisma.semester.findUniqueOrThrow({
    where: {
      id: id,
      isActive: true,
    },
  });

  return result;
};

const updateSemester = async (payload: ISemesterUpdate, id: string) => {
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
  updateSemester,
};
