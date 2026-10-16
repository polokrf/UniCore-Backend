import { prisma } from '../../lib/prisma';
import {
  IAssignTeacher,
  ICourseOffering,
  IUpdateOffer,
} from './courseOffering.interface';
import { AppError } from '../../utils/AppError';
import { Prisma } from '../../../generated/prisma/client';
import { RequestUser } from '../../middleWear/auth';

// Shared by create and assign: the teacher rules live in ONE place.
type TeacherDb = Pick<
  Prisma.TransactionClient,
  'teacherProfile' | 'classRoutine'
>;

// 404 when the teacher does not exist
const findTeacherOrThrow = async (db: TeacherDb, teacherId: string) => {
  const teacher = await db.teacherProfile.findUnique({
    where: { id: teacherId },
    include: { user: { select: { isActive: true } } },
  });
  if (!teacher) {
    throw new AppError(404, 'teacher not found');
  }
  return teacher;
};

//   409 teacher not approved / not active / user blocked
//   400 teacher and course belong to different departments
//   409 teacher already has an overlapping class
// `offeringId` is given when the offering already exists (assign). A brand-new
// offering has no routines yet, so there is nothing that could overlap.
const assertTeacherEligible = async (
  db: TeacherDb,
  teacher: Awaited<ReturnType<typeof findTeacherOrThrow>>,
  courseDepartmentId: string,
  offeringId?: string,
) => {
  // blocking a user only flips User.isActive, so check the account as well
  if (
    teacher.status !== 'APPROVED' ||
    !teacher.isActive ||
    !teacher.user.isActive
  ) {
    throw new AppError(409, 'This teacher is not approved or active');
  }
  if (courseDepartmentId !== teacher.departmentId) {
    throw new AppError(
      400,
      'Teacher and course must belong to the same department',
    );
  }
  if (!offeringId) return;

  // Same rule as editing a routine: a teacher cannot have two overlapping
  // classes on one day. Compare every active routine of this offering with the
  // teacher's active routines in their OTHER offerings (touching times such as
  // 10:30-11:00 after 09:00-10:30 are fine, like in updateRoutine).
  const routines = await db.classRoutine.findMany({
    where: { courseOfferingId: offeringId, isActive: true },
    select: { day: true, startTime: true, endTime: true },
  });
  if (routines.length > 0) {
    const conflict = await db.classRoutine.findFirst({
      where: {
        isActive: true,
        courseOfferingId: { not: offeringId },
        courseOffering: { teacherId: teacher.id },
        OR: routines.map(r => ({
          day: r.day,
          startTime: { lt: r.endTime },
          endTime: { gt: r.startTime },
        })),
      },
      include: { courseOffering: { include: { course: true } } },
    });
    if (conflict) {
      throw new AppError(
        409,
        `This teacher already has a class at this time (${conflict.courseOffering.course.code}, ${conflict.day} ${conflict.startTime}-${conflict.endTime})`,
      );
    }
  }
};

const offeringWithTeacher = {
  course: true,
  semester: true,
  teacher: { include: { user: { select: { firstName: true, email: true } } } },
} satisfies Prisma.CourseOfferingInclude;

// Create an offering, optionally with its teacher. Everything runs in ONE
// transaction: if the teacher is rejected (404 / 409 / 400) nothing is created.
const createCourseOffering = async (payload: ICourseOffering) => {
  const { courseId, semesterId, capacity, section, fee, teacherId } = payload;

  return prisma.$transaction(async tx => {
    const isExitCourseOffering = await tx.courseOffering.findUnique({
      where: {
        courseId_semesterId_section: {
          courseId,
          semesterId,
          section,
        },
      },
    });
    if (isExitCourseOffering) {
      throw new AppError(409, 'this courseOffering already exists');
    }
    const isCourse = await tx.course.findUniqueOrThrow({
      where: {
        id: courseId,
      },
    });
    if (!isCourse?.isActive) {
      throw new AppError(409, 'this courseOffering not available right now');
    }
    const isSemester = await tx.semester.findUniqueOrThrow({
      where: {
        id: semesterId,
      },
    });
    if (!isSemester.isActive) {
      throw new AppError(409, 'this courseOffering not available right now');
    }

    if (teacherId) {
      const teacher = await findTeacherOrThrow(tx, teacherId);
      await assertTeacherEligible(tx, teacher, isCourse.departmentId);
    }

    return tx.courseOffering.create({
      data: {
        courseId,
        semesterId,
        section,
        capacity,
        fee,
        ...(teacherId ? { teacherId } : {}),
      },
      include: offeringWithTeacher,
    });
  });
};

const getAllCourseOffering = async () => {
  const result = await prisma.courseOffering.findMany({
    where: {
      isActive: true,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getSingleCourseOffering = async (id: string) => {
  const result = await prisma.courseOffering.findUniqueOrThrow({
    where: {
      id: id,
      isActive: true,
    },
  });

  return result;
};

const updateCourseOffering = async (payload: IUpdateOffer, id: string) => {
  const result = await prisma.courseOffering.update({
    where: {
      id: id,
    },
    data: {
      ...payload,
    },
  });

  return result;
};

// Assign (or change) the teacher of one offering. Admin / super admin only.
//   404 offering or teacher does not exist
//   409 same teacher already assigned; teacher not approved, active or blocked;
//       teacher already has an overlapping class (checked last)
//   400 teacher and course belong to different departments
// Only `teacherId` is ever written, nothing else from the request body.
const assignCourseOfferingTeacher = async (
  payload: IAssignTeacher,
  id: string,
) => {
  const { teacherId } = payload;

  const offering = await prisma.courseOffering.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!offering) {
    throw new AppError(404, 'course offering not found');
  }

  const teacher = await findTeacherOrThrow(prisma, teacherId);

  if (offering.teacherId === teacher.id) {
    throw new AppError(
      409,
      'this teacher is already assigned to this course offering',
    );
  }

  await assertTeacherEligible(
    prisma,
    teacher,
    offering.course.departmentId,
    id,
  );

  return prisma.courseOffering.update({
    where: { id },
    data: { teacherId: teacher.id },
    include: offeringWithTeacher,
  });
};

// Class roster of one offering.
//   TEACHER: only for an offering assigned to them (403 otherwise)
//   ADMIN / SUPER_ADMIN: any offering
// Cancelled enrollments are never listed. Only what a teacher needs about a
// student is returned (no phone, address, date of birth).
type RosterQuery = {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  status?: unknown;
};
const getRoster = async (id: string, user: RequestUser, query: RosterQuery) => {
  const offering = await prisma.courseOffering.findUniqueOrThrow({
    where: { id },
    include: { course: true, semester: true },
  });

  if (user.role === 'TEACHER') {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!teacher || offering.teacherId !== teacher.id) {
      throw new AppError(
        403,
        'forbidden access: this course is not assigned to you',
      );
    }
  }

  const status =
    typeof query.status === 'string' && query.status
      ? query.status.toUpperCase()
      : undefined;
  if (status && status !== 'PENDING' && status !== 'CONFIRMED') {
    throw new AppError(400, 'status must be PENDING or CONFIRMED');
  }
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  const where: Prisma.EnrollmentWhereInput = {
    courseOfferingId: id,
    status: status ? (status as 'PENDING' | 'CONFIRMED') : { not: 'CANCELLED' },
    ...(search && {
      student: {
        OR: [
          { studentId: { contains: search, mode: 'insensitive' } },
          { user: { firstName: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ],
      },
    }),
  };

  const [rows, total, grouped] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { student: { user: { firstName: 'asc' } } },
      select: {
        id: true,
        status: true,
        enrolledAt: true,
        student: {
          select: {
            id: true,
            studentId: true,
            batch: true,
            semester: true,
            user: { select: { firstName: true, email: true, image: true } },
          },
        },
      },
    }),
    prisma.enrollment.count({ where }),
    prisma.enrollment.groupBy({
      by: ['status'],
      where: { courseOfferingId: id },
      _count: { _all: true },
    }),
  ]);

  const countOf = (name: string) =>
    grouped.find(g => g.status === name)?._count._all ?? 0;
  const confirmed = countOf('CONFIRMED');
  const pending = countOf('PENDING');

  return {
    offering: {
      id: offering.id,
      section: offering.section,
      capacity: offering.capacity,
      course: {
        code: offering.course.code,
        title: offering.course.title,
        credit: offering.course.credit,
      },
      semester: { name: offering.semester.name, year: offering.semester.year },
    },
    // summary ignores search / status filters on purpose
    summary: {
      capacity: offering.capacity,
      confirmed,
      pending,
      total: confirmed + pending,
    },
    data: rows,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

export const courseOfferingService = {
  createCourseOffering,
  getAllCourseOffering,
  getSingleCourseOffering,
  updateCourseOffering,
  assignCourseOfferingTeacher,
  getRoster,
};
