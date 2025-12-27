import { prisma } from "../../config/prisma.js";
import { alertQueue } from "../../queues/alerts.queue.js";

export default async function createAlert({ type, recipient, payload }) {

  const alert = await prisma.alerts.create({
    data: {
      type,
      recipient,
      payload,
      status: "queued"
    }
  });

  await alertQueue.add("send-alert", {
    alertId: alert.id
  });

  return alert;
}
