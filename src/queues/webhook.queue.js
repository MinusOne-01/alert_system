import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const webhookQueue = new Queue("webhook-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});
