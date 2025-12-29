import { prisma } from "../../config/prisma.js";
import { alertQueue } from "../../queues/alerts.queue.js";
import { dispatchWebhook } from "../../webhooks/dispatchWebhook.js";

export async function createAlert({ type, recipient, payload, scheduledAt }) {
  
  const status = scheduledAt ? "scheduled" : "queued";

  const alert = await prisma.alerts.create({
    data: {
      type,
      recipient,
      payload,
      status,
      scheduledAt
    }
  });

  const delay = scheduledAt ? scheduledAt.getTime() - Date.now() : 0;

  await alertQueue.add( "send-alert",
    { alertId: alert.id },
    delay > 0 ? { delay } : {}
  );
  if(delay > 0) console.log("Scheduled!");

  return alert;
}

export async function cancelAlert( id ) {

  const alert = await prisma.alerts.findUnique({
    where: { id }
  });

  if (!alert) {
    const err = new Error("Alert not found");
    err.code = "NOT_FOUND";
    throw err;
  }

  if (alert.status === "cancelled") {
    return alert;
  }

  if (["sent", "failed"].includes(alert.status)) {
    const err = new Error(
      `Cannot cancel alert in '${alert.status}' state`
    );
    err.code = "INVALID_STATE";
    throw err;
  }

  const cancel = await prisma.alerts.update({
    where: { id },
    data: { status: "cancelled" }
  });
  
  // send webhook after db state change
  await dispatchWebhook("alert.cancelled", {
    alertId: alert.id
  });

  console.log("Cancelled!");
  
  return cancel;

}

export async function rescheduleAlert( id, newDate ){

    const alert = await prisma.alerts.findUnique({
        where: { id }
    });

    if (!alert) {
        const err = new Error("Alert not found");
        err.code = "NOT_FOUND";
        throw err;
    }

    if (["sent", "failed", "cancelled"].includes(alert.status)) {
        const err = new Error(
            `Cannot cancel alert in '${alert.status}' state`
        );
        err.code = "INVALID_STATE";
        throw err;
    }

    await prisma.alerts.update({
        where: { id },
        data: { status: "cancelled" }
    });

    const newAlert = await createAlert({
        type: alert.type,
        recipient: alert.recipient,
        payload: alert.payload,
        scheduledAt: newDate
    });

    return newAlert;

}
