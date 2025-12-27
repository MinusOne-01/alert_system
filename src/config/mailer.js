import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false, // true only for 465
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});
