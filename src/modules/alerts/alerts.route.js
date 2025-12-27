import { Router } from "express";
import requestAlert from "./alerts.controller.js";

const router = Router();

router.post("/send", requestAlert);

export default router;