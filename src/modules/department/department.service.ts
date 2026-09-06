import { prisma } from "../../lib/prisma"
import { IDepartment, IDepartmentUpdate } from "./department.interface"

const createDepartment = async (payload:IDepartment) => {
  const { name, code, description } = payload
  
  const isDepartment = await prisma.department.findUnique({
    where: {
      code:code
    }
  })

  if (isDepartment) {
    throw new Error('this department already created')
  }


  const department = await prisma.department.create({
    data: {
      name: name,
      code: code,
      description:description
    }
  })

  return department
}

const getAllDepartment = async () => { 
  
  const result = await prisma.department.findMany({
    where: {
      isActive:true
    }
  })

  return result

}
const getSingleDepartment = async (id:string) => { 
  const result = await prisma.department.findUnique({
    where: {
      id,
      isActive:true
     }
  })
  
  return result

}
const updateDepartment = async (payload:IDepartmentUpdate) => { 
  const result = await prisma.department.update({
    where: {
      id:payload.id,
     
    },
    data: {
      ...payload
    }
  })
  
  return result

}
const deleteDepartment = async (id:string) => { 
  await prisma.department.delete({
    where: {
      id:id,
     
    },
   
  })
  
  

}



export const departmentService = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment
}