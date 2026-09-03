import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma"
import redisClient from "./lib/redis"


const server = async () => {
  try {
    await prisma.$connect()
    console.log('db is connect')
    await redisClient.connect()
    console.log('redis is connect')

    app.listen(config.port, () => {
      console.log(`server is run port ${config.port}`);
    })
  } catch (error) {
   await prisma.$disconnect()
    console.log(error)
  }
}

server()