import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalError } from './middleWear/globalError';
import { notFound } from './middleWear/notFound';
import { authRouter } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
import { departmentRouter } from './modules/department/department.route';
import { teacherRouter } from './modules/teacher/teacher.route';

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
app.use('/api/user', userRouter)
app.use('/api/department', departmentRouter)
app.use('/api/teacher-profile',teacherRouter)


// global error handler 
app.use(globalError)
app.use(notFound)


export default app