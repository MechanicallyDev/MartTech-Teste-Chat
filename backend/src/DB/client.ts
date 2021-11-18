import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

console.log("SQL database connected")

export default client;