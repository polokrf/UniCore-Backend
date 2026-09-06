import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalError } from './middleWear/globalError';
import { notFound } from './middleWear/notFound';
import { authRouter } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
const app = express()

// middle wear 
app.use(cors({
  
    origin:true,
    credentials: true,
  
}))

app.use(express.json(),);
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.get('/', (req:Request, res:Response) => {
    res.json({
        message:'server is run '
    })
})

//  router 
app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)


// global error handler 
app.use(globalError)
app.use(notFound)


export default app