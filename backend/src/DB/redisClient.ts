import { createNodeRedisClient } from 'handy-redis'

const redisClient = createNodeRedisClient(
  Number(process.env.REDIS_PORT) || 6379,
  process.env.REDIS_HOST || 'localhost'
)

redisClient.nodeRedis.on('connect', ()=>console.log('Redis connected'))

export default redisClient