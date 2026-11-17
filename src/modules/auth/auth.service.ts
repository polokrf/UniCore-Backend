import config from '../../config';
import { prisma } from '../../lib/prisma';
import { ILogin, IRegister, IVerifyEmail } from './auth.interface';
import bcrypt from 'bcryptjs';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { jwtToken } from '../../utils/jwt';
import { AppError } from '../../utils/AppError';
import redisClient from '../../lib/redis';
import path from 'path';
import ejs from 'ejs'
import transporter from '../../lib/nodemialer';
import crypto from 'crypto'
import { error } from 'console';


const userRegister = async (payload: IRegister) => {
  const { firstName, email, password } = payload;

  const exitsUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exitsUser && !exitsUser.isActive) {
    throw new AppError(403, 'your account has blocked');
  }

  if ( exitsUser?.isEmailVerified) {
    throw new AppError(409, 'email already verified');
  }

  const hasPassword = await bcrypt.hash(password, Number(config.password_salt));
  
  const userData = {
    firstName,
    email,
    password:hasPassword
  }

  const dataKey= `register-user-payload:${email}`
  const setRdisData = await redisClient.set(dataKey,JSON.stringify(userData),
    {
      expiration:{
        type:"EX",
        value:600
      }
    }
  )

  const otp = crypto.randomInt(100000,1000000)
  
  const otpKey = `verify-email-otp:${email}`;
  const setOtp = await redisClient.set(otpKey, otp, {
    expiration: {
      type: 'EX',
      value: 300,
    },
  });


  const ejsFilePath = path.join(
    process.cwd(),
    '/src/modules/Template/register.send.otp.ejs',
  );

  const html = await ejs.renderFile(ejsFilePath, {
    name:firstName,
    otp
  });

  await transporter.sendMail({
    sender: config.sender_email,
    to: email,
    subject: 'Send Register OTP',
    html: html,
  });
  
  
  

  return null
};

const registerEmailVerify = async (payload:IVerifyEmail) => {
  const { email, otp } = payload

  const exitsUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (exitsUser && !exitsUser.isActive) {
    throw new Error('your account has blocked');
  }

  if ( exitsUser?.isEmailVerified) {
    throw new Error('email already verified');
  }

  const otpKey = `verify-email-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey)
  // console.log(redisOtp,'registerOtp')

  if (!redisOtp) {
    throw new Error('redis otp is missing')
  }

  if (redisOtp !== otp) {
    throw new Error('this otp not match plz provide valid OTP')
  }

  await redisClient.del(otpKey)

  const userDataKey = `register-user-payload:${email}`;
  const redisPayload = await redisClient.get(userDataKey)
  if (!redisPayload) {
      throw new Error('user payload missing')
  }

  const userPayload:IRegister = JSON.parse(redisPayload)

  const insertUser = await prisma.user.create({
    data: {
      firstName: userPayload.firstName,
      email: userPayload.email,
      password: userPayload.password,
      isEmailVerified:true

    }
  })

  await redisClient.del(userDataKey)

  const ejsFilePath = path.join(process.cwd(),'/src/modules/Template/verify.email.success.ejs', );

  const html = await ejs.renderFile(ejsFilePath, {
    name:insertUser.firstName,

  });

  await transporter.sendMail({
    sender: config.sender_email,
    to: email,
    subject: 'Email Verified Success',
    html: html,
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email:insertUser.email
    },
    omit: {
      password:true
    }
  })

  const jwtPayload:JwtPayload = {
    userId:user.id,
    name: user?.firstName,
    email: user.email,
    role: user.role,
  }

  const accessToken = jwtToken.singToken(jwtPayload, config.access_secret, {
    expiresIn: config.access_expired,
  } as SignOptions);

  const refreshToken = jwtToken.singToken(jwtPayload, config.refresh_secret, {
    expiresIn: config.refresh_expired,
  } as SignOptions);

  return {
    user,
    accessToken,
    refreshToken
  }
}


const reSendOtp = async(email:string)=>{

  const dataKey = `register-user-payload:${email}`;

  const userData = await redisClient.get(dataKey)
  if(!userData){
    throw new Error('user data time expire plz register agin')
  }

  const redisUserData = JSON.parse(userData)

  

 const otp = crypto.randomInt(100000, 1000000);

 const otpKey = `verify-email-otp:${email}`;

 const oldOtp = await redisClient.get(otpKey)

  if(oldOtp){
  await redisClient.del(otpKey)
  }


 const setOtp = await redisClient.set(otpKey, otp, {
   expiration: {
     type: 'EX',
     value: 300,
   },
 });

 const ejsFilePath = path.join(
   process.cwd(),
   '/src/modules/Template/register.send.otp.ejs',
 );

 const html = await ejs.renderFile(ejsFilePath, {
   name: redisUserData?.firstName,
   otp,
 });

 await transporter.sendMail({
   sender: config.sender_email,
   to: email,
   subject: 'Send Register OTP',
   html: html,
 });

 return null;
}

const userLogin = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new AppError(401, 'you do not login plz register first');
  }

  if (!user.isActive) {
    throw new AppError(403, 'you are blocked');
  }

  if (!user.isEmailVerified) {
    throw new AppError(403, 'you are not verified user plz verified first');
  }

  const userPassword = user.password;
  const comPassword = await bcrypt.compare(password, userPassword);

  if (!comPassword) {
    throw new AppError(
      401,
      'your password do not match plz give valid password',
    );
  }

  const jwtPayload: JwtPayload = {
    userId: user.id,
    name: user?.firstName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtToken.singToken(jwtPayload, config.access_secret, {
    expiresIn: config.access_expired,
  } as SignOptions);

  const refreshToken = jwtToken.singToken(jwtPayload, config.refresh_secret, {
    expiresIn: config.refresh_expired,
  } as SignOptions);

  return {
    accessToken,
    refreshToken,
  };
};

const myProfile = async (userId: string) => {
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    // the applicant's own application status, so the app can show
    // pending / approved / rejected after register -> apply
    include: {
      studentProfile: {
        select: {
          id: true,
          status: true,
          batch: true,
          createdAt: true,
          department: { select: { name: true, code: true } },
        },
      },
      teacherProfile: {
        select: {
          id: true,
          status: true,
          designation: true,
          rejectionReason: true,
          createdAt: true,
          department: { select: { name: true, code: true } },
        },
      },
    },
  });

  return profile;
};

export const authService = {
  userRegister,
  reSendOtp,
  registerEmailVerify,
  userLogin,
  myProfile,
};
