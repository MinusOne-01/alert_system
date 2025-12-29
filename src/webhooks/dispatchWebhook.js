import { webhookQueue } from "../queues/webhook.queue.js";
import { prisma } from "../config/prisma.js";

export async function dispatchWebhook(event, payload) {
    const webhooks = await prisma.webhook.findMany({
        where: { isActive: true }
    });

    console.log("Webhooks-> ", webhooks);

    for (const webhook of webhooks) {
        await webhookQueue.add("deliver-webhook", {
            webhookId: webhook.id,
            event,
            payload
        });
        console.log("webhook queued...");
    }
}
