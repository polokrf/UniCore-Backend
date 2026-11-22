import { prisma } from "../lib/prisma"
import { vectorStore } from "../lib/vectoreStore"
import { reindexAllCourseOffering } from "../modules/chat/chat.indexing"



const main = async() =>{
  try {
   const count = await reindexAllCourseOffering()
   console.log(`Indexed ${count} approved course offering`) 
  } catch (error) {
    console.log(`Indexed failed: ${error}`)
  }finally{
    vectorStore.end()
    await prisma.$disconnect()
  }
}


main()