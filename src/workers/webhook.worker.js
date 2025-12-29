import redis from "../config/redis.js"
import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import crypto from "crypto";

const worker = new Worker("webhook-queue", async(job) => {
    console.log("webhook worker here!");
    const { webhookId, event, payload } = job.data;

    const webhook = await prisma.webhook.findUnique({ where: { id: webhookId }});

    if (!webhook || !webhook.isActive) return;

    const body = JSON.stringify({ event, payload });

    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(body)
      .digest("hex");

    try{

        const res = await fetch(webhook.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Signature": signature
            },
            body
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        await prisma.webhookDeliveryLog.create({
            data: {
                webhookId,
                event,
                payload,
                status: "success"
            }
        });
        console.log("webhook call success!");

    }
    catch(err){

        await prisma.webhookDeliveryLog.create({
            data: {
                webhookId,
                event,
                payload,
                status: "error",
                error: err.message
            }
        });
        console.log("webhook call retrying...");

        throw err; // retry
    }  

}, { connection: redis});

export default worker;