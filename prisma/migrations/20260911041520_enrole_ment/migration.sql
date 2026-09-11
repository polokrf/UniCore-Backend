/*
  Warnings:

  - You are about to drop the column `fee` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_offerings" ADD COLUMN     "fee" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "fee";
