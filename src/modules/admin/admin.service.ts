import { Prisma } from '../../../generated/prisma/client';
import {
  Role,
  StudentStatus,
  TeacherStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import {
  IEnrollment,
  IResult,
  IStudent,
  ITeacher,
  IUser,
} from './admin.interface';
import crypto from 'crypto';
import { AppError } from '../../utils/AppError';

const getAllUsers = async (query: IUser) => {
  const {
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const isActiveBoolean =
    isActive === 'ACTIVE' ? true : isActive === 'BLOCKED' ? false : undefined;

  const where: Prisma.UserWhereInput = {
    ...(role && {
      role,
    }),

    ...(isActiveBoolean !== undefined && {
      isActive: isActiveBoolean,
    }),

    ...(search && {
      OR: [
        {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    }),
  };

  const allowedSortFields = ['createdAt', 'firstName', 'email', 'role'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      omit: {
        password: true,
      },
      orderBy: {
        [safeSortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      skip,
      take: limitNumber,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    data: users,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
  };
};
const getAllTeacher = async (query: ITeacher) => {
  const {
    search,
    status,

    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const isActiveBoolean =
    isActive !== undefined
      ? isActive === true || (isActive as any) === 'true'
      : undefined;

  const where: Prisma.TeacherProfileWhereInput = {
    ...(status && {
      status,
    }),

    ...(isActiveBoolean !== undefined && {
      isActive: isActiveBoolean,
    }),

    ...(search && {
      OR: [
        {
          employeeId: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          designation: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    }),
  };

  const allowedSortFields = ['createdAt', 'employeeId', 'designation'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const [teachers, total] = await prisma.$transaction([
    prisma.teacherProfile.findMany({
      where,
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        department: true,
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: limitNumber,
    }),

    prisma.teacherProfile.count({
      where,
    }),
  ]);

  return {
    data: teachers,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
  };
};

const getAllStudent = async (query: IStudent) => {
  const {
    search,
    status,

    batch,
    semester,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const isActiveBoolean =
    isActive !== undefined
      ? isActive === true || (isActive as any) === 'true'
      : undefined;

  const batchNumber =
    batch !== undefined && batch !== null && batch !== ('' as any)
      ? Number(batch)
      : undefined;

  const semesterNumber =
    semester !== undefined && semester !== null && semester !== ('' as any)
      ? Number(semester)
      : undefined;

  const where: Prisma.StudentProfileWhereInput = {
    ...(status && {
      status,
    }),

    ...(batchNumber !== undefined &&
      !Number.isNaN(batchNumber) && {
        batch: batchNumber,
      }),

    ...(semesterNumber !== undefined &&
      !Number.isNaN(semesterNumber) && {
        semester: semesterNumber,
      }),

    ...(isActiveBoolean !== undefined && {
      isActive: isActiveBoolean,
    }),

    ...(search && {
      OR: [
        {
          studentId: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    }),
  };

  const allowedSortFields = ['createdAt', 'batch', 'semester', 'studentId'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const [students, total] = await prisma.$transaction([
    prisma.studentProfile.findMany({
      where,
      include: {
        user: true,
        department: true,
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: limitNumber,
    }),

    prisma.studentProfile.count({
      where,
    }),
  ]);

  return {
    data: students,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
  };
};

const getAllEnrolment = async (query: IEnrollment) => {
  const {
    search,
    status,

    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const where: Prisma.EnrollmentWhereInput = {
    ...(status && {
      status,
    }),

    ...(search && {
      OR: [
        {
          student: {
            studentId: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          student: {
            user: {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          student: {
            user: {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          courseOffering: {
            course: {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          courseOffering: {
            course: {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    }),
  };

  const allowedSortFields = ['createdAt', 'status'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const [enrollments, total] = await prisma.$transaction([
    prisma.enrollment.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
            department: true,
          },
        },
        courseOffering: {
          include: {
            course: true,
            semester: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
        payments: true,
        result: true,
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: limitNumber, //
    }),

    prisma.enrollment.count({
      where,
    }),
  ]);

  return {
    data: enrollments,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
  };
};

const getAllResult = async (query: IResult) => {
  const {
    search,
    published,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const publishedBoolean =
    published === 'Active'
      ? true
      : published === 'InActive'
        ? false
        : undefined;

  const where: Prisma.ResultWhereInput = {
    ...(publishedBoolean !== undefined && {
      published: publishedBoolean,
    }),

    ...(search && {
      OR: [
        {
          enrollment: {
            student: {
              studentId: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          enrollment: {
            student: {
              user: {
                firstName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
        {
          enrollment: {
            student: {
              user: {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],
    }),
  };

  const allowedSortFields = ['createdAt', 'marks', 'grade'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  const [results, total] = await prisma.$transaction([
    prisma.result.findMany({
      where,
      include: {
        enrollment: {
          include: {
            courseOffering: { include: { course: true, semester: true } },
            student: {
              include: {
                user: {
                  omit: {
                    password: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: limitNumber,
    }),

    prisma.result.count({
      where,
    }),
  ]);

  return {
    data: results,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
  };
};

const updateTeacherStatus = async (id: string, status: TeacherStatus) => {
  const teacher = await prisma.teacherProfile.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (teacher.status === status) {
    throw new AppError(409, `Teacher is already ${status}`);
  }

  const employeeId =
    status === 'APPROVED'
      ? crypto.randomInt(100000, 1000000).toString()
      : undefined;

  const result = await prisma.$transaction(
    async tx => {
      const updatedTeacher = await tx.teacherProfile.update({
        where: {
          id,
        },
        data: {
          status,
          ...(employeeId && {
            employeeId,
          }),
        },
      });

      if (status === 'APPROVED') {
        await tx.user.update({
          where: {
            id: teacher.userId,
          },
          data: {
            role: 'TEACHER',
          },
        });
      }

      return updatedTeacher;
    },
    {
      maxWait: 10000,
      timeout: 10000,
    },
  );

  return result;
};

const updateStudentStatus = async (id: string, status: StudentStatus) => {
  const student = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (student.status === status) {
    throw new AppError(409, `Student is already ${status}`);
  }

  const result = await prisma.$transaction(async tx => {
    const updatedStudent = await tx.studentProfile.update({
      where: {
        id,
      },
      data: {
        status,

        ...(status === 'APPROVED' && {
          studentId: crypto.randomInt(100000, 1000000).toString(),
        }),
      },
    });

    if (status === 'APPROVED') {
      await tx.user.update({
        where: {
          id: student.userId,
        },
        data: {
          role: 'STUDENT',
        },
      });
    }

    return updatedStudent;
  });

  return result;
};
export const adminService = {
  getAllEnrolment,
  getAllUsers,
  getAllStudent,
  getAllTeacher,
  getAllResult,
  updateTeacherStatus,
  updateStudentStatus,
};
