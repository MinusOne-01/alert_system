import createAlert from "./alerts.service.js";

export default async function requestAlert(req, res){

    const { type, recipient, payload } = req.body;

    if(!type || !recipient || !payload ){
        return res.status(400).json({ error: "type, recipient, and payload are required" });
    }

    try{
        const alert = await createAlert({ type, recipient, payload });

        return res.status(202).json({
            alertId: alert.id,
            status: alert.status
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ error: "Failed to enqueue alert" });
    }

}