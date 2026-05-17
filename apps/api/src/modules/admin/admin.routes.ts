import { Router } from "express";
import { requireAuth, requireRootAdmin } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { createAdminSchema } from "./admin.types";
import { listAdminsHandler, createAdminHandler, deleteAdminHandler } from "./admin.controller";

export const adminRouter = Router();

adminRouter.get("/",       requireAuth,                          listAdminsHandler);
adminRouter.post("/",      requireAuth, validate(createAdminSchema), createAdminHandler);
adminRouter.delete("/:id", requireAuth, requireRootAdmin,        deleteAdminHandler);
