CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "uncore_embedding" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT,
    "metadata" JSONB,
    "embedding" vector NOT NULL,

    CONSTRAINT "uncore_embedding_pkey" PRIMARY KEY ("id")
);
