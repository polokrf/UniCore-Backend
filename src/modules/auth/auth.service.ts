
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { ILogin, IRegister } from "./auth.interface"
import bcrypt from "bcryptjs"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtToken } from "../../utils/jwt"



const userRegister = async (payload:IRegister) => {
  const { firstName, email, password } = payload
   
  const exitsUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exitsUser && !exitsUser.isActive) {
    throw new Error('your account has blocked');
  }

  if (exitsUser && exitsUser.isEmailVerified) {
    throw new Error('email already verified');
  }

  const hasPassword = await bcrypt.hash(password, Number(config.password_salt));


  const insertUser = await prisma.user.create({
    data: {
      firstName: firstName,
      email:email,
      password:hasPassword,
      isEmailVerified: true,
    },
  });


  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: insertUser.email,
    },
    omit: {
      password: true,
    },
  });

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
    user,
    accessToken,
    refreshToken,
  };
  

 
  
  
}

// const registerEmailVerify = async (payload:IVerifyEmail) => {
//   const { email, otp } = payload

//   const exitsUser = await prisma.user.findUnique({
//     where: {
//       email
//     }
//   })

//   if (exitsUser && !exitsUser.isActive) {
//     throw new Error('your account has blocked');
//   }

//   if (exitsUser && exitsUser.isEmailVerified) {
//     throw new Error('email already verified');
//   }
  
//   const otpKey = `verify-email-otp:${email}`;
//   const redisOtp = await redisClient.get(otpKey)

//   if (!redisOtp) {
//     throw new Error('redis otp is missing')
//   }

//   if (redisOtp !== otp) {
//     throw new Error('this otp not match plz provide valid OTP')
//   }

//   await redisClient.del(otpKey)

//   const userDataKey = `register-user-payload:${email}`;
//   const redisPayload = await redisClient.get(userDataKey)
//   if (!redisPayload) {
//       throw new Error('user payload missing')
//   }
  
//   const userPayload:IRegister = JSON.parse(redisPayload)

//   const insertUser = await prisma.user.create({
//     data: {
//       firstName: userPayload.firstName,
//       email: userPayload.email,
//       password: userPayload.password,
//       isEmailVerified:true
      
//     }
//   })

//   await redisClient.del(userDataKey)

  

//   const ejsFilePath = path.join(process.cwd(),'/src/modules/Template/verify.email.success.ejs', );

//   const html = await ejs.renderFile(ejsFilePath, {
//     name:insertUser.firstName,
  
//   });

//   await transporter.sendMail({
//     sender: config.sender_email,
//     to: email,
//     subject: 'Email Verified Success',
//     html: html,
//   });

//   const user = await prisma.user.findUniqueOrThrow({
//     where: {
//       email:insertUser.email
//     },
//     omit: {
//       password:true
//     }
//   })


//   const jwtPayload:JwtPayload = {
//     userId:user.id,
//     name: user?.firstName,
//     email: user.email,
//     role: user.role,
//   }

//   const accessToken = jwtToken.singToken(jwtPayload, config.access_secret, {
//     expiresIn: config.access_expired,
//   } as SignOptions);

//   const refreshToken = jwtToken.singToken(jwtPayload, config.refresh_secret, {
//     expiresIn: config.refresh_expired,
//   } as SignOptions);
 
  
//   return {
//     user,
//     accessToken,
//     refreshToken
//   }
// }


const userLogin = async (payload:ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email:email
    }
  })

  if (!user) {
    throw new Error('you do not login plz register first')
  }

  if (!user.isActive) {
    throw new Error('you are blocked')
  }

  if (!user.isEmailVerified) {
    throw new Error('you are not verified user plz verified first')
  }

  const userPassword = user.password
  const comPassword = await bcrypt.compare(password, userPassword)
  
  if (!comPassword) {
    throw new Error('your password do not match plz give valid password')
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


}


const myProfile = async (userId:string) => {
  const profile = await prisma.user.findUnique({
    where: {
      id:userId
    }
  })

  return profile
}

export const authService = {
  userRegister,
 
  userLogin,
  myProfile
}