import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { MongoRateLimitStore } from "@/shared/middleware/mongo-rate-limit-store";
import { loginSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.types";
import {
  loginHandler, verifyOtpHandler, resendOtpPublicHandler,
  forgotPasswordHandler, resetPasswordHandler,
  refreshHandler, logoutHandler, meHandler,
} from "./auth.controller";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiadas solicitudes de refresco. Intenta en 15 minutos." },
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

// Límite estricto para forgot-password — previene spam de emails
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
});

authRouter.post("/login",            loginLimiter,         validate(loginSchema),           loginHandler);
authRouter.post("/verify-otp",       otpLimiter,           validate(verifyOtpSchema),        verifyOtpHandler);
authRouter.post("/resend-otp",       otpLimiter,           validate(resendOtpSchema),        resendOtpPublicHandler);
authRouter.post("/forgot-password",  passwordResetLimiter, validate(forgotPasswordSchema),   forgotPasswordHandler);
authRouter.post("/reset-password",   passwordResetLimiter, validate(resetPasswordSchema),    resetPasswordHandler);
authRouter.post("/refresh",          refreshLimiter,       refreshHandler);
authRouter.post("/logout",           requireAuth,          logoutHandler);
authRouter.get("/me",                requireAuth,          meHandler);
