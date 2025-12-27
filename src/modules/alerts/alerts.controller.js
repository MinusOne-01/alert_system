import { createAlert, cancelAlert, rescheduleAlert } from "./alerts.service.js";

export async function requestAlert(req, res){

    const { type, recipient, payload, scheduledAt } = req.body;

    if(!type || !recipient || !payload ){
        return res.status(400).json({ error: "type, recipient, and payload are required" });
    }

    const scheduleDate = scheduledAt ? new Date(scheduledAt) : null;

    if (scheduleDate && scheduleDate < new Date()) {
        return res.status(400).json({ error: "scheduledAt must be in the future" });
    }

    try{
        const alert = await createAlert({ type, recipient, payload, scheduledAt: scheduleDate });

        return res.status(202).json({
            alertId: alert.id,
            status: alert.status,
            scheduledAt: alert.scheduledAt
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ error: "Failed to enqueue alert" });
    }

}

export async function requestCancelAlert(req, res) {

    const { id } = req.params;

    try {
        const cancel = await cancelAlert(id);

        return res.json({
            alertId: cancel.id,
            status: cancel.status
        });
    }
    catch (err) {
        if (err.code === "NOT_FOUND") {
            return res.status(404).json({ error: err.message });
        }

        if (err.code === "INVALID_STATE") {
            return res.status(409).json({ error: err.message });
        }

        console.error(err);
        return res.status(500).json({ error: "Failed to cancel alert" });
    }
    
}

export async function requestRescheduleAlert(req, res){

    const { id } = req.params;
    const { scheduledAt } = req.body;

    const newDate = new Date(scheduledAt);
    if (newDate < new Date()) {
        return res.status(400).json({ error: "scheduledAt must be in future" });
    }

    try {
        const newAlert = await rescheduleAlert( id, newDate );

        return res.json({
            oldAlertId: id,
            newAlertId: newAlert.id,
            status: newAlert.status,
            scheduledAt: newAlert.scheduledAt
        });
    }
    catch (err) {
        if (err.code === "NOT_FOUND") {
            return res.status(404).json({ error: err.message });
        }

        if (err.code === "INVALID_STATE") {
            return res.status(409).json({ error: err.message });
        }

        console.error(err);
        return res.status(500).json({ error: "Failed to cancel alert" });
    }


}