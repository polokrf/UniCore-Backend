import cron from "node-cron"
import { prisma } from "./prisma"
import { Role } from "../../generated/prisma/enums"
import { reindexAllCourseOffering } from "../modules/chat/chat.indexing"


export const deleteUnActiveCourseOfferingAndTeacher = async()=>{
  cron.schedule('/10 * * * *',async()=>{
   try {
    const oneHourAgo= new Date(Date.now() - 60 * 60 * 1000)
    const deleteTeacher = await prisma.user.deleteMany({
      where:{
        role:Role.TEACHER,
        isEmailVerified:false,
        createdAt:{lt:oneHourAgo},
        
      }
    })

    const deleteCourseOffering = await prisma.courseOffering.deleteMany({
      where:{
        isActive:false
      }
    })
    
    if(deleteTeacher.count > 0){
      console.log(`Cron Deleted ${deleteTeacher.count} unverified email teacher applications old`)
    }
    if(deleteCourseOffering.count > 0){
      console.log(
        `Cron Deleted ${deleteCourseOffering.count} close courseOffering applications old`,
      );
    }

   } catch (error) {
    console.log(error)
   }
  })
}


export const reindexCourseOfferingEmbedding = async()=>{
  cron.schedule('0 3 * * *', async()=>{
    try {
     const count = await reindexAllCourseOffering()
     console.log(`cron : re-index ${count} courseOffering`)

    } catch (error) {
      console.error("Cron : failed to re-index doctors for the chatbot")
    }
  })
}