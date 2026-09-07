import { prisma } from '../../lib/prisma';
import { IAssignTeacher, ICourseOffering, IUpdateOffer } from './courseOffering.interface';


const createCourseOffering= async (payload:ICourseOffering) => {
  const { courseId,semesterId,capacity,section } = payload;

  const isExitCourseOffering = await prisma.courseOffering.findUnique({
    where: {
      courseId_semesterId_section: {
        courseId,
        semesterId,
        section
     }
    },
  });

  if (isExitCourseOffering) {
    throw new Error('this courseOffering already exists');
  }

  const isCourse = await prisma.course.findUniqueOrThrow({
    where: {
      id:courseId
    }
  })

  if (!isCourse?.isActive) {
    throw new Error('this courseOffering not available right now');
  }


  const isSemester = await prisma.semester.findUniqueOrThrow({
    where: {
      id:semesterId
    }
  })

  if (!isSemester.isActive) {
    throw new Error('this courseOffering not available right now');
  }

  
  const result = await prisma.courseOffering.create({
    data: {
      courseId,
      semesterId,
      
      section,
      capacity

    },
  });

  return result;
};



const getAllCourseOffering = async () => {
  const result = await prisma.courseOffering.findMany({
    where: {
      isActive: true,
    },
  });

  return result;
};

const getSingleCourseOffering = async (id: string) => {
  const result = await prisma.courseOffering.findUnique({
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

const assignCourseOfferingTeacher = async (
  payload: IAssignTeacher,
  id: string,
) => {

  const { teacherId } = payload;

  const isCourse = await prisma.courseOffering.findUniqueOrThrow({
    where: {
      id:id
    },
    include: {
      course:true
    }
  })
  
  const isTeacher = await prisma.teacherProfile.findUniqueOrThrow({
    where: {
      id:teacherId
    }
  })

  if (isTeacher.isActive || isTeacher.status !== 'APPROVED') {
    throw new Error('This teacher is not approved or active')
  }

  if (isCourse.course.departmentId !== isTeacher.departmentId) {
     throw new Error('Teacher and course must belong to the same department');
  }
  const result = await prisma.courseOffering.update({
    where: {
      id: id,
    },
    data: {
     teacherId
    },
  });

  return result;
};


export const courseOfferingService = {
  createCourseOffering,
  getAllCourseOffering,
  getSingleCourseOffering,
  updateCourseOffering,
  assignCourseOfferingTeacher
};
