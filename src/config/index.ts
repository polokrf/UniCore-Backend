
import dotenv, { DotenvConfigOptions } from 'dotenv'
import { access } from 'fs';
import path from 'path';

dotenv.config(path.join(process.cwd(), '.env') as DotenvConfigOptions);


export default {
  port: process.env.PORT,
  password_salt: process.env.PASSWORD_SALT!,
  access_secret: process.env.ACCESS_SECRET!,
  access_expired: process.env.ACCESS_EXPIRED!,
  refresh_secret: process.env.REFRESH_SECRET!,
  refresh_expired: process.env.REFRESH_EXPIRED!,
  smtp_user: process.env.SMTP_USER!,
  smtp_password: process.env.SMTP_PASSWORD!,
  sender_email: process.env.SENDER_EMAIL!,
  redis_username: process.env.REDIS_USERNAME!,
  redis_password: process.env.REDIS_PASSWORD!,
  redis_host: process.env.REDIS_HOST!,
  redis_port: process.env.REDIS_PORT!,
  cloud_name:process.env.CLOUD_NAME!,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};
