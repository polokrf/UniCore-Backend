-- DropForeignKey
ALTER TABLE "course_offerings" DROP CONSTRAINT "course_offerings_teacherId_fkey";

-- AlterTable
ALTER TABLE "course_offerings" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
