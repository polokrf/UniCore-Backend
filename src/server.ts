import app from "./app"
import config from "./config"
import { getGrantToken } from "./lib/bkash"

import transporter from "./lib/nodemialer"
import { prisma } from "./lib/prisma"
import redisClient from "./lib/redis"


const server = async () => {
  try {
    await prisma.$connect()
    console.log('db is connect')
    await redisClient.connect()
    console.log('redis is connect')
    
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