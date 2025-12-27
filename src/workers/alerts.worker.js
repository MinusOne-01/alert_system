import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import redis from "../config/redis.js";
import { transporter } from "../config/mailer.js";

const worker = new Worker( "alert-queue", async (job) => {

    const { alertId } = job.data;

    // Fetch alert
    const alert = await prisma.alerts.findUnique({
      where: { id: alertId }
    });

    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    // Idempotency guard
    if (alert.status === "sent") {
      return;
    }

    await prisma.alerts.update({
      where: { id: alertId },
      data: { status: "processing", retryCount: job.attemptsMade }
    });
     
    try {
        // send email
        if (alert.type === "EMAIL") {
            const { subject, body } = alert.payload;

            await transporter.sendMail({
                from: env.SMTP_USER,
                to: alert.recipient,
                subject,
                text: body
            });
        }

        await prisma.alertDeliveryLog.create({
            data: {
                alertId,
                attempt: job.attemptsMade + 1,
                status: "success"
            }
        });

        await prisma.alerts.update({
            where: { id: alertId },
            data: { status: "sent" }
        });
        console.log("Sent!");
    }
    catch (err) {
        await prisma.alertDeliveryLog.create({
            data: {
                alertId,
                attempt: job.attemptsMade + 1,
                status: "error",
                error: err.message
            }
        });

        const isLastAttempt =
            job.attemptsMade + 1 >= job.opts.attempts;

        if (isLastAttempt) {
            await prisma.alerts.update({
                where: { id: alertId },
                data: {
                    status: "failed",
                    retryCount: job.attemptsMade + 1
                }
            });
            console.log("Failed!");
        }
        console.log("Retrying...");

        throw err;
    }


  }, { connection: redis });

export default worker;
