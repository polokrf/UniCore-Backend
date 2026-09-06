/*
  Warnings:

  - The `batch` column on the `student_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "student_profiles" DROP COLUMN "batch",
ADD COLUMN     "batch" INTEGER;

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "credit" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
