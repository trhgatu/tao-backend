import log from '@common/logger'
import { createClient } from 'redis'

export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
  },
})

redisClient.on('error', (err) => {
  log.error(`Redis Client Error: ${err?.message || err}`)
})


redisClient.on('connect', () => {
  log.info('Redis connected successfully')
})

