import { Router } from "express";
import { requestAlert, requestCancelAlert, requestRescheduleAlert } from "./alerts.controller.js";

const router = Router();

router.post("/send", requestAlert);
router.post("/:id/cancel", requestCancelAlert);
router.post("/:id/reschedule", requestRescheduleAlert);

export default router;