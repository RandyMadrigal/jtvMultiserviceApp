import type { Response, NextFunction } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import type { UploadRequest } from "@/shared/middleware/upload.middleware";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.service";

type Req = AuthRequest & UploadRequest;

export async function list(_req: Req, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await listProducts()); } catch (e) { next(e); }
}

export async function get(req: Req, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await getProduct(req.params.id as string)); } catch (e) { next(e); }
}

export async function create(req: Req, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await createProduct(req.body, req.adminId!, req.uploadedImages ?? []));
  } catch (e) { next(e); }
}

export async function update(req: Req, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await updateProduct(req.params.id as string, req.body, req.uploadedImages));
  } catch (e) { next(e); }
}

export async function remove(req: Req, res: Response, next: NextFunction): Promise<void> {
  try { await deleteProduct(req.params.id as string); res.status(204).send(); } catch (e) { next(e); }
}
