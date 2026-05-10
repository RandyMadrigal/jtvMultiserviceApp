import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { createAdminSchema } from "./admin.types";
import { createAdmin, getMe } from "./admin.controller";

export const adminRouter = Router();

// Requires auth for all admin routes
adminRouter.use(requireAuth);

adminRouter.get("/me", getMe);
adminRouter.post("/", validate(createAdminSchema), createAdmin);
