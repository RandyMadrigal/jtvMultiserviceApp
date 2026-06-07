import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { logger } from "@/shared/utils/logger";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.service";

export const list = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.json(await listCategories());
});

export const get = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(await getCategory(req.params.id as string));
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await createCategory(req.body, req.adminId!);
  logger.info({
    audit:  true,
    action: "category.create",
    by:     req.adminId,
    target: (result as { _id: unknown })._id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Categoría creada");
  res.status(201).json(result);
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const result = await updateCategory(id, req.body);
  logger.info({
    audit:  true,
    action: "category.update",
    by:     req.adminId,
    target: id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Categoría actualizada");
  res.json(result);
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await deleteCategory(id);
  logger.info({
    audit:  true,
    action: "category.delete",
    by:     req.adminId,
    target: id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Categoría eliminada");
  res.status(204).send();
});
