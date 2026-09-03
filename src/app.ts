import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalError } from './middleWear/globalError';
import { notFound } from './middleWear/notFound';
import { authRouter } from './modules/auth/auth.route';
const app = express()

// middle wear 
app.use(cors({
  
    origin:'**',
    credentials: true,
  
}))

app.use(express.json(),);
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//  router 
app.use('/api/auth',authRouter)


// global error handler 
app.use(globalError)
app.use(notFound)


export default app