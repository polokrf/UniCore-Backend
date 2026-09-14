-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('A_PLUS', 'A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'D', 'F');

-- CreateTable
CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "marks" DOUBLE PRECISION NOT NULL,
    "grade" "Grade" NOT NULL,
    "gradePoint" DOUBLE PRECISION NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "results_enrollmentId_key" ON "results"("enrollmentId");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
