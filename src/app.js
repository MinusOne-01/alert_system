import express from "express";
import cors from "cors";
import alertRoutes from "./modules/alerts/alerts.route.js"

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use("/alert", alertRoutes);



export default app;