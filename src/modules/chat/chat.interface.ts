import { Prisma } from "../../../generated/prisma/client";

export interface ISendChatMessagePayload{
  message:string,
  sessionId?:string
}





export interface IChatCourse {
  id: string;
  fee: Prisma.Decimal | null;
  section: string;
  capacity: number | null;

  semester: {
    name: string;
    startDate: Date;
    endDate: Date;
    year: number;
  };

  teacher: {
    specialization: string;
    qualification: string;
    phone: string;
    bio: string | null;
    user: {
      firstName: string;
    };
  } | null;

  course: {
    code:number,
    title: string;
    description: string | null;
    department: {
      id:string;
      name: string;
      description: string | null;
    };
  };
}



export interface IChatResponse {
  sessionId:string,
  answer: string,
  courses:unknown[] 
}