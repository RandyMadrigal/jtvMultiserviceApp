import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
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
  res.status(201).json(await createCategory(req.body, req.adminId!));
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(await updateCategory(req.params.id as string, req.body));
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deleteCategory(req.params.id as string);
  res.status(204).send();
});
