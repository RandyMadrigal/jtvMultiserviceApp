import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { logger } from "@/shared/utils/logger";
import { listAdmins, createAdmin, resendOtp, deleteAdmin } from "./admin.service";
import type { CreateAdminDto } from "./admin.types";

export const listAdminsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page  = Math.max(1, Number(req.query.page)  || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  res.json(await listAdmins(page, limit));
});

export const createAdminHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createAdmin(req.body as CreateAdminDto);
  logger.info({
    audit:  true,
    action: "admin.create",
    by:     req.adminId,
    target: result._id,
    email:  result.email,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Admin creado");
  res.status(201).json(result);
});

export const resendOtpHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  await resendOtp(req.params["id"] as string);
  res.json({ message: "Código reenviado correctamente" });
});

export const deleteAdminHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetId = req.params["id"] as string;
  await deleteAdmin(targetId, req.adminId!);
  logger.info({
    audit:  true,
    action: "admin.delete",
    by:     req.adminId,
    target: targetId,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Admin eliminado");
  res.status(204).send();
});
