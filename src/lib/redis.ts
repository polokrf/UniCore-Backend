import { createClient } from "redis";

const redisClient = createClient({
  username: 'default',
  password: 'gcVoGsGkZl6M3u5Dam7Ev3ujVq8gkodh',
  socket: {
    host: 'festive-aquamarine-balmy-21314.db.redis.io',
    port: 16620,
  },
});


export default redisClient