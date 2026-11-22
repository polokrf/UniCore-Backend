/*
  Warnings:

  - You are about to drop the `uncore_embedding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "uncore_embedding";

-- CreateTable
CREATE TABLE "unicore_embedding" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector NOT NULL,

    CONSTRAINT "unicore_embedding_pkey" PRIMARY KEY ("id")
);
