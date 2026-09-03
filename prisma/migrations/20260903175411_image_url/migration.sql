/*
  Warnings:

  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "imagePublicId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT '';
