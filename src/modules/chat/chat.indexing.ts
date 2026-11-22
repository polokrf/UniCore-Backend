import { Document } from "@langchain/core/documents"
import { prisma } from "../../lib/prisma"
import { vectorStore } from "../../lib/vectoreStore"
import { Prisma } from "../../../generated/prisma/client"
import { fa } from "zod/v4/locales"


const INDEX_BATCH_SIZE= 20


const indexableCourseSelect ={
  id :true,
  courseId :true,
  semesterId:true,
  teacherId  :true,
  section :true,
  fee : true
} as const

type TIndexCourse = {
  courseId: string;
  id: string;
  semesterId: string;
  teacherId: string | null;
  section: string;
  fee: Prisma.Decimal | null;
  isActive: boolean;
};

export const buildCourseDocument = (course: TIndexCourse)=>{
 return  new Document({
    pageContent:[
      `course Fee : ${course.fee}`,
      `course section : ${course.section}`

    ].filter(Boolean).join("\n"),
    metadata:{courseId:course.id}
  })
}

export const upsertCourseEmbedding = async(courseId:string)=>{
  const course = await prisma.courseOffering.findUnique({
    where:{id: courseId},
    select:{
      ...indexableCourseSelect,
      isActive:true
    }

  })

  await vectorStore.delete({ids:[courseId]})
  if(!course || course.isActive === false){
    return
  }

  await vectorStore.addDocuments([buildCourseDocument(course)],{
    ids:[courseId]
  })
}

export const reindexAllCourseOffering =  async()=>{
  const courses = await prisma.courseOffering.findMany({
    where:{
      isActive:false
    }
  })

  await prisma.unicoreEmbedding.deleteMany(({
    where:{
      id:{notIn:courses.map(course => course.id)}
    }
  }))

  for( let i = 0 ; i< courses.length ; i+=INDEX_BATCH_SIZE){
    const batch = courses.slice(i, i + INDEX_BATCH_SIZE);
    const ids = batch.map(course => course.id)
    
    await vectorStore.delete({ids})
    await vectorStore.addDocuments(batch.map(buildCourseDocument), {ids})
  }

  return courses.length
}


