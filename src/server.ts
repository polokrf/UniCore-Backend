import app from "./app"
import config from "./config"
import { getGrantToken } from "./lib/bkash"
import { deleteUnActiveCourseOfferingAndTeacher, reindexCourseOfferingEmbedding } from "./lib/cron"

import transporter from "./lib/nodemialer"
import { prisma } from "./lib/prisma"
import redisClient from "./lib/redis"
import { reindexAllCourseOffering } from "./modules/chat/chat.indexing"


const server = async () => {
  try {
    await prisma.$connect()
    console.log('db is connect')
    await redisClient.connect()
    console.log('redis is connect')
   
   
    // await deleteUnActiveCourseOfferingAndTeacher()
    await reindexCourseOfferingEmbedding()
    
    // await transporter.verify();
    // console.log('gmail nodemailer  connect success');
    
    app.listen(config.port, () => {
      console.log(`server is run port ${config.port}`);
    })
  } catch (error) {
   await prisma.$disconnect()
    console.log(error)
  }
}

server()

