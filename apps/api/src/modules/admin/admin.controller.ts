import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { listAdmins, createAdmin } from "./admin.service";
import type { CreateAdminDto } from "./admin.types";

export const listAdminsHandler = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.json(await listAdmins());
});

export const createAdminHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createAdmin(req.body as CreateAdminDto);
  res.status(201).json(result);
});
