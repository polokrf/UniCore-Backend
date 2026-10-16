import { createClient } from "redis";
import config from "../config";

const settings = {
  REDIS_HOST: config.redis_host,
  REDIS_PORT: config.redis_port,
  REDIS_USERNAME: config.redis_username,
  REDIS_PASSWORD: config.redis_password,
};
const missing = Object.entries(settings)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length > 0) {
  throw new Error(`Missing redis settings in .env: ${missing.join(', ')}`);
}



const redisClient = createClient({
  username: config.redis_username,
  password: config.redis_password,
  socket: {
    host: config.redis_host,
    port: Number(config.redis_port),
  },
});


export default redisClient