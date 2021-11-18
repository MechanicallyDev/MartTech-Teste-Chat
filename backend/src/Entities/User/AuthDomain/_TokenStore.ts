import redis from '@database/redisClient'

export default {
  async get(key: string) {
    return await redis.get(key)
  },

  set(key: string, value: string, ttl: number) {
    return redis.set(key, value, 'EX', ttl)
  },

  async del(key: string) {
    return await redis.del(key)
  }
}
