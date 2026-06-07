import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, requireRootAdmin } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { validateObjectId } from "@/shared/middleware/validateObjectId.middleware";
import { MongoRateLimitStore } from "@/shared/middleware/mongo-rate-limit-store";
import { createAdminSchema } from "./admin.types";
import { listAdminsHandler, createAdminHandler, resendOtpHandler, deleteAdminHandler } from "./admin.controller";

const createAdminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiadas cuentas creadas recientemente. Intenta en 1 hora." },
});

const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  store:   new MongoRateLimitStore(),
  message: { error: "Demasiados reenvíos. Intenta en 15 minutos." },
});

export const adminRouter = Router();

adminRouter.get("/",                requireAuth,                                                                    listAdminsHandler);
adminRouter.post("/",               requireAuth, requireRootAdmin, createAdminLimiter, validate(createAdminSchema), createAdminHandler);
adminRouter.post("/:id/resend-otp", requireAuth, resendOtpLimiter, validateObjectId(), requireRootAdmin,            resendOtpHandler);
adminRouter.delete("/:id",          requireAuth, validateObjectId(), requireRootAdmin,                              deleteAdminHandler);
