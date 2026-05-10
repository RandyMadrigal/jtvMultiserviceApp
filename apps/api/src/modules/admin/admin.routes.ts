import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { createAdminSchema } from "./admin.types";
import { listAdmins, createAdmin } from "./admin.controller";

export const adminRouter = Router();

adminRouter.get("/", requireAuth, listAdmins);
adminRouter.post("/", requireAuth, validate(createAdminSchema), createAdmin);
