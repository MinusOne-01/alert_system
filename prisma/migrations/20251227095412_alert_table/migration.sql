-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('queued', 'processing', 'sent', 'failed');

-- CreateTable
CREATE TABLE "Alerts" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'queued',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alerts_status_idx" ON "Alerts"("status");

-- CreateIndex
CREATE INDEX "Alerts_createdAt_idx" ON "Alerts"("createdAt");
