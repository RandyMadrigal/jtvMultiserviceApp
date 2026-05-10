import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "@/shared/middleware/validate.middleware";
import { loginSchema } from "./auth.types";
import { loginHandler } from "./auth.controller";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

authRouter.post("/login", loginLimiter, validate(loginSchema), loginHandler);
