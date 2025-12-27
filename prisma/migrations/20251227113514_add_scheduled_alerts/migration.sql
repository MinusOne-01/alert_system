-- AlterEnum
ALTER TYPE "StatusType" ADD VALUE 'scheduled';

-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "scheduledAt" TIMESTAMP(3);
