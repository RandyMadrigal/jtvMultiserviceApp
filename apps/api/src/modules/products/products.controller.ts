import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import type { UploadRequest } from "@/shared/middleware/upload.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { logger } from "@/shared/utils/logger";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.service";

type Req = AuthRequest & UploadRequest;

const VALID_STATUSES = ["disponible", "agotado", "promocion"] as const;

export const list = asyncHandler(async (req: Req, res: Response) => {
  const page     = Number(req.query.page)     || 1;
  const limit    = Number(req.query.limit)    || 20;
  const rawSearch = (req.query.search as string | undefined)?.slice(0, 100);
  const search    = rawSearch?.trim() || undefined;
  const category = (req.query.category as string | undefined) ?? undefined;

  // I-3d: Validar que status sea uno de los valores permitidos; si no, ignorarlo
  const rawStatus = req.query.status as string | undefined;
  const status    = VALID_STATUSES.includes(rawStatus as typeof VALID_STATUSES[number])
    ? rawStatus
    : undefined;

  res.json(await listProducts({ page, limit, search, category, status }));
});

export const get = asyncHandler(async (req: Req, res: Response) => {
  res.json(await getProduct(req.params.id as string));
});

export const create = asyncHandler(async (req: Req, res: Response) => {
  const result = await createProduct(req.body, req.adminId!, req.uploadedImages ?? []);
  logger.info({
    audit:  true,
    action: "product.create",
    by:     req.adminId,
    target: (result as { _id: unknown })._id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Producto creado");
  res.status(201).json(result);
});

export const update = asyncHandler(async (req: Req, res: Response) => {
  const id = req.params.id as string;
  const result = await updateProduct(id, req.body, req.uploadedImages);
  logger.info({
    audit:  true,
    action: "product.update",
    by:     req.adminId,
    target: id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Producto actualizado");
  res.json(result);
});

export const remove = asyncHandler(async (req: Req, res: Response) => {
  const id = req.params.id as string;
  await deleteProduct(id);
  logger.info({
    audit:  true,
    action: "product.delete",
    by:     req.adminId,
    target: id,
    ip:     req.ip,
    reqId:  req.requestId,
  }, "Producto eliminado");
  res.status(204).send();
});
