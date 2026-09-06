-- CreateTable
CREATE TABLE "course_offerings" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_offerings_courseId_semesterId_section_key" ON "course_offerings"("courseId", "semesterId", "section");

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
