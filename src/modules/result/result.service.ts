import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleWear/auth";
import { IResult } from "./result.interface";

const createResult = async (payload: IResult) => {
  const {enrollmentId,grade,gradePoint,marks}= payload
  const isEnrolment = await prisma.enrollment.findUniqueOrThrow({
    where: {
       id:enrollmentId
     }
  })
  
  if (isEnrolment.status !== 'CONFIRMED') {
    throw new Error('plz course enrol first')
  }

  const isResult = await prisma.result.findUnique({
    where: {
      enrollmentId
    }
  })

  if (isResult) {
    throw new Error('this result already exits')
  }

  const result = await prisma.result.create({
    data: {
      enrollmentId,
      grade,
      gradePoint,
      marks
    }
  })

  return result
};

const getResult = async (userId:string) => {
  const isStudent = await prisma.studentProfile.findUniqueOrThrow({
    where: {
     userId:userId
   }
  }) 
  
  if (!isStudent.isActive || isStudent.status !== 'APPROVED') {
    throw new Error('this student inActive or not approve')
  }



  const results = await prisma.result.findMany({
    where: {
      published: true,
      enrollment: {
        studentId: isStudent.id,
      },
    },
  });

  return results


};

const getSingleResult = async (id: string, user: RequestUser) => {
   const isStudent = await prisma.studentProfile.findUniqueOrThrow({
     where: {
       userId:user.userId,
     },
   });

   if (!isStudent.isActive || isStudent.status !== 'APPROVED') {
     throw new Error('this student inActive or not approve');
   }

   const result = await prisma.result.findFirstOrThrow({
     where: {
       id,
       published: true,
       enrollment: {
         studentId: isStudent.id,
       },
     },
   });
  
  return result
};

export const resultService = {
  createResult,
  getResult,
  getSingleResult,
};