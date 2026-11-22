import { AIMessage, HumanMessage } from "@langchain/core/messages";
import redisClient from "../../lib/redis";

import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts"
import { CHAT_QUESTION_PROMPT, CHAT_SYSTEM_PROMPT } from "./chat.promt";
import { chatModal } from "../../lib/llm";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { vectorStore } from "../../lib/vectoreStore";
import { prisma } from "../../lib/prisma";

import { IChatResponse, ISendChatMessagePayload } from "./chat.interface";
import crypto from 'crypto'
import { AppError } from "../../utils/AppError";

const TOP_K_COURSES=4;
const MAX_HISTORY_MESSAGE =10;
const  HISTORY_TTL_SECONDS =60*60;

type TStoreMessage =  { role: 'human' | 'ai', content:string }

const historyKey = (sessionId:string)=> `chat:session : ${sessionId}`

const getHistory = async(sessionId:string):Promise<TStoreMessage[]> =>{
  const raw = await redisClient.get(historyKey(sessionId))
  return raw ? JSON.parse(raw) as TStoreMessage[] : []
}


const saveHistory = async(sessionId: string,history:TStoreMessage[])=>{
  await redisClient.set(historyKey(sessionId),JSON.stringify(history.slice(-MAX_HISTORY_MESSAGE)), {
    expiration:{type:"EX",value:HISTORY_TTL_SECONDS}
  })
  
}

const toLangChainMessages = (history: TStoreMessage[]) => {
 return  history.map(message =>
    message.role === 'human'
      ? new HumanMessage(message.content)
      : new AIMessage(message.content),
  );
};
const condenseQuestionChain = ChatPromptTemplate.fromMessages([
  ['system', CHAT_QUESTION_PROMPT],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
])
  .pipe(chatModal)
  .pipe(new StringOutputParser());

const answerChain = ChatPromptTemplate.fromMessages([
  ['system', CHAT_SYSTEM_PROMPT],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
])
  .pipe(chatModal)
  .pipe(new StringOutputParser());

const retrieveCourseIds = async (searchQuery: string) => {
  const results = await vectorStore.similaritySearchWithScore(
    searchQuery,
    TOP_K_COURSES,
  );

  return results.map(([document]) => document.metadata.courseId as string);
};

const getCourseOfferingWithTeacherAndCourse = async (courseIds: string[]) => {
  if (!courseIds.length) {
    return [];
  }

  // const now = new Date();
  // const startOfToday = startOfDay(now);
  // const startOfTomorrow = addDays(startOfToday, 1);

  const courses = await prisma.courseOffering.findMany({
    where: {
      id: {
        in: courseIds,
      },
      isActive: true,
    },
    select: {
      id: true,
      fee: true,
      section: true,
      semester: {
        select:{
          name:true,
          startDate:true,
          endDate:true,
          year:true
        }
      },
      teacher: {
        select:{
          specialization:true,
          qualification:true,
          phone:true,
          bio:true,

          user:{
            select:{
              firstName:true
            }
          }
        }
      },
      course: {
        select:{
          title:true,
          description:true,
          
          department:{
            select:{
              name:true,
              description:true
            }
          }
        }
      },
      capacity: true,
    },
  });

  return courses
};

type TChatCourse = Awaited<
  ReturnType<typeof getCourseOfferingWithTeacherAndCourse>
>[number];

const buildContext = (courses: TChatCourse[]) => {
  if (!courses.length) {
    return 'no matching course were found';
  }

  return courses;
};

const sendMessage = async(payload:ISendChatMessagePayload):Promise<IChatResponse> =>{
 const sessionId = payload.sessionId ?? crypto.randomUUID();
 const history = await getHistory(sessionId)
 const historyMessages = toLangChainMessages(history)

 try {
  const searchQuery = history.length ? await condenseQuestionChain.invoke({
    history: historyMessages,
    question : payload.message
  }): payload.message;


  const coursesId = await retrieveCourseIds(searchQuery)
  const courses = await getCourseOfferingWithTeacherAndCourse(coursesId)
   
  const answer = await answerChain.invoke({
    context: buildContext(courses),
    history:historyMessages,
    question: payload.message
  })

  await saveHistory(sessionId, [
    ...history,
    { role : 'human', content: payload.message},
    {role: 'ai', content: answer},
  ]);

  

  return {
    sessionId,
    answer,
    courses: courses
  }

 } catch (error:any) {
  console.log('chat : fail generate ans',error.message)
  throw new AppError(500, 'something was worn plz try later')
 }
}


export const chatService = {
  sendMessage
}


