
import dotenv, { DotenvConfigOptions } from 'dotenv'
import path from 'path';

dotenv.config(path.join(process.cwd(), '.env') as DotenvConfigOptions);


export default {
port:process.env.PORT
}
