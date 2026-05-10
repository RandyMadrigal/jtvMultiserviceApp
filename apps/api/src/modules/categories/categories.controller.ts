import type { Response, NextFunction } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.service";

export async function list(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await listCategories()); } catch (e) { next(e); }
}

export async function get(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await getCategory(req.params.id)); } catch (e) { next(e); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await createCategory(req.body, req.adminId!));
  } catch (e) { next(e); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await updateCategory(req.params.id, req.body)); } catch (e) { next(e); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { await deleteCategory(req.params.id); res.status(204).send(); } catch (e) { next(e); }
}
