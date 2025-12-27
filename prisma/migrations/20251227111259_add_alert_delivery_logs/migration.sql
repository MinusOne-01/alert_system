-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "AlertDeliveryLog" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertDeliveryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlertDeliveryLog_alertId_idx" ON "AlertDeliveryLog"("alertId");

-- CreateIndex
CREATE INDEX "AlertDeliveryLog_createdAt_idx" ON "AlertDeliveryLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AlertDeliveryLog" ADD CONSTRAINT "AlertDeliveryLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
