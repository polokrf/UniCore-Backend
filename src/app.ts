import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalError } from './middleWear/globalError';
import { notFound } from './middleWear/notFound';
const app = express()

app.use(cors({
  
    origin:'**',
    credentials: true,
  
}))

app.use(express.json(),);
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
 



app.use(globalError)
app.use(notFound)


export default app