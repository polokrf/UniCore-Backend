import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { globalError } from './middleWear/globalError';
import { notFound } from './middleWear/notFound';
import { authRouter } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
import { departmentRouter } from './modules/department/department.route';
import { teacherRouter } from './modules/teacher/teacher.route';
import { studentRouter } from './modules/student/student.route';
import { CourseRouter } from './modules/course/course.route';
import { semesterRouter } from './modules/semester/semester.route';
import { courseOfferingRouter } from './modules/courseOffering/courseOffering.route';
import { enrollmentRouter } from './modules/enrollment/enrollment.route';
import response from './utils/clientResponse';
import { getGrantToken } from './lib/bkash';
import { paymentRouter } from './modules/payment/payment.route';
import { routineRouter } from './modules/classRoutin/routine.route';

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

// app.get('/test', async (req: Request, res: Response, next: NextFunction) => {
//   const getBGrantToken = await getGrantToken();

//    response(
//     res,
//        {
//            status: 201,
//            success: true,
//            message:"success"
//    }
//   );

//   console.log(getBGrantToken);
// });


//  router 
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/department', departmentRouter)
app.use('/api/teacher-profile', teacherRouter)
app.use('/api/student-profile', studentRouter)
app.use('/api/course', CourseRouter)
app.use('/api/semester', semesterRouter)
app.use('/api/course-offering', courseOfferingRouter)
app.use('/api/enrolment',enrollmentRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/class-routine', routineRouter)

// global error handler 
app.use(globalError)
app.use(notFound)


export default app