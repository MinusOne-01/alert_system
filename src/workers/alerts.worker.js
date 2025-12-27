import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import redis from "../config/redis.js";

const worker = new Worker( "alert-queue", async (job) => {

    const { alertId } = job.data;

    // Fetch alert
    const alert = await prisma.alerts.findUnique({
      where: { id: alertId }
    });

    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    // Mark processing
    await prisma.alerts.update({
      where: { id: alertId },
      data: { status: "processing" }
    });

    // TEMP: simulate work
    console.log(`Processing alert ${alertId}`);

    // Simulate success
    await prisma.alerts.update({
      where: { id: alertId },
      data: { status: "sent" }
    });

    return { success: true };

  }, { connection: redis });

export default worker;
