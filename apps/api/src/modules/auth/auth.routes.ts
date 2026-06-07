import { Router, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { MongoRateLimitStore } from "@/shared/middleware/mongo-rate-limit-store";
import { env } from "@/shared/config/env";
import { loginSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.types";
import {
  loginHandler, verifyOtpHandler, resendOtpPublicHandler,
  forgotPasswordHandler, resetPasswordHandler,
  refreshHandler, logoutHandler, meHandler,
} from "./auth.controller";

export const authRouter = Router();

const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());

// Bloquea peticiones cross-site al endpoint de refresh en producción.
// El atacante no puede leer el nuevo access token (CORS lo bloquea), pero sin
// este guard puede forzar rotaciones de refresh token inútiles.
function csrfOriginGuard(req: Request, res: Response, next: NextFunction): void {
  if (env.NODE_ENV !== "production") { next(); return; }
  const origin = req.headers.origin as string | undefined;
  if (!origin || allowedOrigins.includes(origin)) { next(); return; }
  res.status(403).json({ error: "Origen no permitido" });
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore("login"),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore("refresh"),
  message: { error: "Demasiadas solicitudes de refresco. Intenta en 15 minutos." },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore("otp"),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

// Límites independientes para forgot y reset — evita que intentos de reset
// consuman la cuota de nuevas solicitudes de forgot-password (y viceversa)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore("forgot-pwd"),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore("reset-pwd"),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

authRouter.post("/login",           loginLimiter,          validate(loginSchema),          loginHandler);
authRouter.post("/verify-otp",      otpLimiter,            validate(verifyOtpSchema),       verifyOtpHandler);
authRouter.post("/resend-otp",      otpLimiter,            validate(resendOtpSchema),       resendOtpPublicHandler);
authRouter.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema),  forgotPasswordHandler);
authRouter.post("/reset-password",  resetPasswordLimiter,  validate(resetPasswordSchema),   resetPasswordHandler);
authRouter.post("/refresh",         refreshLimiter,        csrfOriginGuard, refreshHandler);
authRouter.post("/logout",          requireAuth,           logoutHandler);
authRouter.get("/me",               requireAuth,           meHandler);
