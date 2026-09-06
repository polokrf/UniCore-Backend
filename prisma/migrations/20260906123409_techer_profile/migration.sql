-- CreateEnum
CREATE TYPE "TeacherStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "teacher_profiles" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "TeacherStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "employeeId" DROP NOT NULL;
