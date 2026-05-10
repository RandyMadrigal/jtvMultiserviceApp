import type { Request, Response, NextFunction } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.service";

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await listProducts()); } catch (e) { next(e); }
}

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await getProduct(req.params.id)); } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.status(201).json(await createProduct(req.body)); } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await updateProduct(req.params.id, req.body)); } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { await deleteProduct(req.params.id); res.status(204).send(); } catch (e) { next(e); }
}
