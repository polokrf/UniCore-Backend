import { Prisma } from "../../../generated/prisma/client";
import { Role, StudentStatus, TeacherStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IEnrollment, IResult, IStudent, ITeacher, IUser } from "./admin.interface";

const getAllUsers = async (query:IUser ) => {
  const {
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(role && {
      role,
    }),

    ...(isActive !== undefined && {
      isActive,
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

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      omit: {
        password:true
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getAllTeacher = async (query:ITeacher ) => {
  const {
    search,
    status,
    departmentId,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.TeacherProfileWhereInput = {
    ...(status && {
      status,
    }),

    ...(departmentId && {
      departmentId,
    }),

    ...(isActive !== undefined && {
      isActive,
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

  const [teachers, total] = await prisma.$transaction([
    prisma.teacherProfile.findMany({
      where,
      include: {
        user: true,
        department: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.teacherProfile.count({
      where,
    }),
  ]);

  return {
    data: teachers,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getAllStudent = async (query:IStudent ) => {
  const {
    search,
    status,
    departmentId,
    batch,
    semester,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.StudentProfileWhereInput = {
    ...(status && {
      status,
    }),

    ...(departmentId && {
      departmentId,
    }),

    ...(batch !== undefined && {
      batch,
    }),

    ...(semester !== undefined && {
      semester,
    }),

    ...(isActive !== undefined && {
      isActive,
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

  const [students, total] = await prisma.$transaction([
    prisma.studentProfile.findMany({
      where,
      include: {
        user: true,
        department: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.studentProfile.count({
      where,
    }),
  ]);

  return {
    data: students,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getAllEnrolment = async (query:IEnrollment ) => {
  const {
    search,
    status,
    courseOfferingId,
    semesterId,
    courseId,
    studentId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.EnrollmentWhereInput = {
    ...(status && {
      status,
    }),

    ...(courseOfferingId && {
      courseOfferingId,
    }),

    ...(studentId && {
      studentId,
    }),

    ...(semesterId && {
      courseOffering: {
        semesterId,
      },
    }),

    ...(courseId && {
      courseOffering: {
        courseId,
      },
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

  const [enrollments, total] = await prisma.$transaction([
    prisma.enrollment.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              omit: {
                password:true
              }
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
        payment: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.enrollment.count({
      where,
    }),
  ]);

  return {
    data: enrollments,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getAllResult = async (query:IResult) => {
  const {
    search,
    grade,
    semesterId,
    courseId,
    departmentId,
    published,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.ResultWhereInput = {
    ...(grade && {
      grade,
    }),

    ...(published !== undefined && {
      published,
    }),

    ...(departmentId || semesterId || courseId
      ? {
          enrollment: {
            ...(departmentId && {
              student: {
                departmentId,
              },
            }),

            ...(semesterId || courseId
              ? {
                  courseOffering: {
                    ...(semesterId && {
                      semesterId,
                    }),
                    ...(courseId && {
                      courseId,
                    }),
                  },
                }
              : {}),
          },
        }
      : {}),

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
        {
          enrollment: {
            courseOffering: {
              course: {
                code: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
        {
          enrollment: {
            courseOffering: {
              course: {
                title: {
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

  const [results, total] = await prisma.$transaction([
    prisma.result.findMany({
      where,
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                user: {
                  omit: {
                    password:true
                  }
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
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.result.count({
      where,
    }),
  ]);

  return {
    data: results,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
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
    throw new Error(`Teacher is already ${status}`);
  }

  const result = await prisma.$transaction(async tx => {
    const updatedTeacher = await tx.teacherProfile.update({
      where: {
        id,
      },
      data: {
        status,
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
  });

  return result;
};

const updateStudentStatus = async (id: string, status: StudentStatus) => {
  const student = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (student.status === status) {
    throw new Error(`Student is already ${status}`);
  }

  const result = await prisma.$transaction(async tx => {
    const updatedStudent = await tx.studentProfile.update({
      where: {
        id,
      },
      data: {
        status,
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
  updateStudentStatus
  
};
