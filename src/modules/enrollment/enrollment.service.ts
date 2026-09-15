import { prisma } from '../../lib/prisma';
import { IEnroll } from './enrollment.interface';


const enrollNow= async (payload:IEnroll,userId :string) => {
  const { courseOfferingId } = payload;


  const isUser = await prisma.user.findUniqueOrThrow({
    where: {
      id:userId,
    },
  });

  if (!isUser.isActive) {
    throw new Error('this user not active');
  }

  const isStudent = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  if (!isStudent.isActive || isStudent.status !== 'APPROVED') {
    throw new Error('is student id not active and not approved');
  }


  const isCourseOffer = await prisma.courseOffering.findUniqueOrThrow({
    where: {
      id: courseOfferingId,
    },
  });

  if (!isCourseOffer.isActive) {
    throw new Error('is course offer is not active');
  }
  
  if (!isCourseOffer.fee) {
    throw new Error('is course offer fee null');
  }
  

  const isEnrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseOfferingId: {
       studentId:isStudent.id,
        courseOfferingId
      }
    }
  })

  if (isEnrollment) {
    throw new Error('this enrollment already exits')
  }

  
   
  const isEnrollCount = await prisma.enrollment.count({
    where: {
      
        courseOfferingId,
     
    },
  });

  if (isCourseOffer.capacity !== null && isEnrollCount >= isCourseOffer.capacity) {
     throw new Error('This course offering is full');
  }
  
  


 const result = await prisma.enrollment.create({
    data: {
      courseOfferingId,
      studentId:isStudent.id

    },
  });

  return result;
};




const getEnroll = async (userId: string) => {

    const student = await prisma.studentProfile.findUniqueOrThrow({
      where: {
        userId,
      },
    });
  
  
  const result = await prisma.enrollment.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      courseOffering: {
        include: {
          course: true,
          semester: true,
          teacher: true,
        },
      },
    },
  });

  return result;
};


const cancelEnroll = async (id: string, userId: string) => {
  const student = await prisma.studentProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (enrollment.studentId !== student.id) {
    throw new Error('You cannot cancel this enrollment');
  }

  if (enrollment.status === 'CANCELLED') {
    throw new Error('This enrollment is already cancelled');
  }
  if (enrollment.status === "CONFIRMED") {
    throw new Error('This enrollment is already CONFIRMED');
  }

  const result = await prisma.enrollment.update({
    where: {
      id,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  return result;
};




export const enrollmentService = {
  enrollNow,
  getEnroll,
  cancelEnroll
};
