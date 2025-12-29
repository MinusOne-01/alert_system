-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('web', 'android', 'ios');

-- CreateTable
CREATE TABLE "PushDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushDevice_token_key" ON "PushDevice"("token");

-- CreateIndex
CREATE INDEX "PushDevice_userId_idx" ON "PushDevice"("userId");
