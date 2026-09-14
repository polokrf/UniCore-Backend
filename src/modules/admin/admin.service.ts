import { StudentStatus, TeacherStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
};

const getAllTeacher = async () => {
  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return teachers;
};

const getAllStudent = async () => {
  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      department: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return students;
};

const getAllEnrolment = async () => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      student: {
        include: {
          user: true,
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
      createdAt: 'desc',
    },
  });

  return enrollments;
};

const getAllResult = async () => {
  const results = await prisma.result.findMany({
    include: {
      enrollment: {
        include: {
          student: {
            include: {
              user: true,
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
      createdAt: 'desc',
    },
  });

  return results;
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
