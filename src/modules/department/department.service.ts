import { Prisma } from '../../../generated/prisma/browser';
import { prisma } from '../../lib/prisma';
import { IDepartment, IDepartmentUpdate, IQuery } from './department.interface';
import { AppError } from '../../utils/AppError';

const createDepartment = async (payload: IDepartment) => {
  const { name, code, description } = payload;

  const isDepartment = await prisma.department.findUnique({
    where: {
      code: code,
    },
  });

  if (isDepartment) {
    throw new AppError(409, 'this department already created');
  }

  const department = await prisma.department.create({
    data: {
      name: name,
      code: code,
      description: description,
    },
  });

  return department;
};

const getAllDepartment = async (query: IQuery) => {
  const { search, isActive, page = 1, limit = 10 } = query;
  const active =
    isActive === 'ACTIVE' ? true : isActive === 'BLOCKED' ? false : undefined;

  const limitNumber = Number(limit);
  const numberPage = Number(page);
  const skip = (numberPage - 1) * limitNumber;

  const where: Prisma.DepartmentWhereInput = {
    ...(active !== undefined && {
      isActive: active,
    }),

    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };
  const result = await prisma.department.findMany({
    where,
    skip,
    take: limitNumber,
  });

  const total = await prisma.department.count({
    where,
  });

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
const getSingleDepartment = async (id: string) => {
  const result = await prisma.department.findUniqueOrThrow({
    where: {
      id,
      isActive: true,
    },
    include: {
      courses: true,
    },
  });

  return result;
};
const updateDepartment = async (payload: IDepartmentUpdate) => {
  const result = await prisma.department.update({
    where: {
      id: payload.id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};
const deleteDepartment = async (id: string) => {
  await prisma.department.delete({
    where: {
      id: id,
    },
  });
};

export const departmentService = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
