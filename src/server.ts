import app from "./app"
import config from "./config"
import { prisma } from "./lib/prisma"


const server = async () => {
  try {
    await prisma.$connect()
    console.log('db is connect')

    app.listen(config.port, () => {
      console.log(`server is run port ${config.port}`);
    })
  } catch (error) {
   await prisma.$disconnect()
    console.log(error)
  }
}

server()