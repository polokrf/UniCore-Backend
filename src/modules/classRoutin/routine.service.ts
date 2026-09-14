
import { fa } from "zod/v4/locales"
import { Prisma, Role } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { RequestUser } from "../../middleWear/auth"
import { IClassRoutine, IClassRoutineUpdate } from "./routine.interface"

const createClassRoutine = async (payload:IClassRoutine) => { 
 

  const { courseOfferingId, day, startTime, endTime, room } = payload

  
  const courseOffering = await prisma.courseOffering.findFirstOrThrow({
    where: {
      id:courseOfferingId
    }
  })


  if (!courseOffering.isActive) {
    throw new Error('this course not active')
  }

    if (!courseOffering.teacherId) {
      throw new Error('No teacher assigned to this course');
    }

  const isTeacher = await prisma.teacherProfile.findFirstOrThrow({
    where: {
      id: courseOffering.teacherId
    }
  })

  if (!isTeacher.isActive || isTeacher.status !== 'APPROVED') {
    throw new Error('this class teacher not active or approved')
  }
  
  const classRoutine = await prisma.classRoutine.findUnique({
    where: {
      courseOfferingId_day_startTime_endTime: {
        courseOfferingId,
        day,
        startTime,
        endTime
      }
    }
  }) 


  if (classRoutine) {
    throw new Error('this routine slot already exist class')
  }


  const roomConflict = await prisma.classRoutine.findFirst({
    where: {
      day,
      room,
      isActive: true,
      startTime: {
        lt:endTime
      },

      endTime: {
        gt:startTime
      }

    }
  })
 

  if (roomConflict) {
    throw new Error('This room is already booked at this time');
  }
   

  const createRoutine = await prisma.classRoutine.create({
    data: {
      courseOfferingId,
      day,
      startTime,
      endTime,
      room
    }
  })


  return createRoutine
  


}


const getAllClassRoutine = async (user:RequestUser) => {
  const where: Prisma.ClassRoutineWhereInput= {
    isActive:true
  }


  if (user.role === Role.STUDENT) {
    const student = await prisma.studentProfile.findUniqueOrThrow({
      where: {
        userId:user.userId
      },
      select: {
        departmentId:true
      }
    })

    where.courseOffering = {
      course: {
        departmentId:student.departmentId
      }
    }
  }

  if (user.role === Role.DEPARTMENT_HEAD) {
    const departmentHead = await prisma.teacherProfile.findUniqueOrThrow({
      where: {
        userId:user.userId
      },
      select: {
        departmentId:true
      }
    })

    where.courseOffering ={
      course: {
        departmentId:departmentHead.departmentId
      }
    }
  }


  if (user.role === Role.TEACHER) {
    const teacher = await prisma.teacherProfile.findUniqueOrThrow({
      where: {
        userId:user.userId
      },
      select:{
        id:true
      }
    })

    where.courseOffering = {
      teacherId:teacher.id
    }
  }


  const routine = await prisma.classRoutine.findMany({
    where,
    include: {
      courseOffering: {
        include: {
          course: true,
          semester: true,
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: [
      {
        day: 'asc',
      },
      {
        startTime: 'asc',
      },
    ],
  });

  return routine

}


const getSingleRoutine = async (id:string) => {
  const result = await prisma.classRoutine.findUniqueOrThrow({
    where: {
      id
    }
  })

  return result
}

const updateRoutine = async (id: string, payload: IClassRoutineUpdate) => {
  const {day,startTime,endTime,room}=payload
  const isRoutine = await prisma.classRoutine.findUniqueOrThrow({
    where: {
    id:id
    },
    include: {
      courseOffering:true
    }
    
  })
  
  const newDay = day ?? isRoutine.day;
  const newRoom = room ?? isRoutine.room

  const newStartTime = startTime ? new Date(`1970-01-01T${startTime}:00`): isRoutine.startTime;
  const newEndTime = endTime? new Date(`1970-01-01T${endTime}:00`): isRoutine.endTime; 

  if (newStartTime >= newEndTime) {
    throw new Error('End time must be after start time');
  }

  const roomConflict = await prisma.classRoutine.findFirst({
    where: {
      id: {
        not: id,
      },
      day: newDay,
      room: newRoom,
      isActive: true,
      startTime: {
        lt: newEndTime,
      },
      endTime: {
        gt: newStartTime,
      },
    },
  });

  if (roomConflict) {
    throw new Error('This room is already booked at this time');
  }

  const teacherId = isRoutine.courseOffering.teacherId;

  if (teacherId) {
    const teacherConflict = await prisma.classRoutine.findFirst({
      where: {
        id: {
          not: id,
        },
        day: newDay,
        isActive: true,
        startTime: {
          lt: newEndTime,
        },
        endTime: {
          gt: newStartTime,
        },
        courseOffering: {
          teacherId,
        },
      },
    });

    if (teacherConflict) {
      throw new Error('This teacher already has a class at this time');
    }
  }


  const updatedRoutine = await prisma.classRoutine.update({
    where: {
      id,
    },
    data: {
      ...(day !== undefined && {
        day:day,
      }),

      ...(startTime !== undefined && {
        startTime: newStartTime,
      }),

      ...(endTime !== undefined && {
        endTime: newEndTime,
      }),

      ... (room !== undefined && {
        room: newRoom,
      }),
    },
  });

  return updatedRoutine;
}





const deleteClassRoutine = async (id: string) => {
  const isRoutine = await prisma.classRoutine.findUnique({
    where: {
      id
    }
  })

  if (!isRoutine) {
    throw new Error('this routine is missing')
  }

  if (!isRoutine.isActive) {
    throw new Error('this routine already deleted')
  }

  await prisma.classRoutine.update({
    where: {
      id
    },
    data: {
      isActive:false
    }
  })  
}
  


export const routineService = {
  createClassRoutine,
  getAllClassRoutine,
  getSingleRoutine,
  updateRoutine,
  deleteClassRoutine
}