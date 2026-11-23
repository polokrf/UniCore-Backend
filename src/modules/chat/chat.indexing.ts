import { Document } from "@langchain/core/documents"
import { prisma } from "../../lib/prisma"
import { vectorStore } from "../../lib/vectoreStore"
import { Prisma } from "../../../generated/prisma/client"



const INDEX_BATCH_SIZE= 20


const indexableCourseSelect = {
  id: true,
  courseId: true,
  semesterId: true,
  teacherId: true,
  section: true,
  fee: true,
  isActive: true,

  course: {
    select: {
      id: true,
      code: true,
      title: true,
      credit: true,
      description: true,
    },
  },
} as const;

type TIndexCourse = Prisma.CourseOfferingGetPayload<{
  select: typeof indexableCourseSelect;
}>;

export const buildCourseDocument = (course: TIndexCourse) => {
  return new Document({
    pageContent: [
      `Course Title: ${course.course.title}`,
      `Course Code: ${course.course.code}`,
      `Course Description: ${course.course.description ?? ''}`,
      `Course Credit: ${course.course.credit}`,
      `Course Fee: ${course.fee ?? ''}`,
      `Course Section: ${course.section}`,
    ].join('\n'),

    metadata: {
      courseOfferingId: course.id,
      courseId: course.courseId,
      semesterId: course.semesterId,
      teacherId: course.teacherId,
    },
  });
};

export const upsertCourseEmbedding = async (courseId: string) => {
  const course = await prisma.courseOffering.findUnique({
    where: { id: courseId },
    select: indexableCourseSelect,
  });

  


  await vectorStore.delete({ ids: [courseId] });
   
  if (!course || !course?.isActive) {
    return;
  }
  
  await vectorStore.addDocuments([buildCourseDocument(course)], {
    ids: [courseId],
  });
};

export const reindexAllCourseOffering = async () => {
  const courses = await prisma.courseOffering.findMany({
    where: {
      isActive: true,
    },
    select: indexableCourseSelect,
  });

  for (let i = 0; i < courses.length; i += INDEX_BATCH_SIZE) {
    const batch = courses.slice(i, i + INDEX_BATCH_SIZE);

    const ids = batch.map(course => course.id);

    await vectorStore.delete({ ids });

    await vectorStore.addDocuments(batch.map(buildCourseDocument), { ids });
  }

  return courses.length;
};

