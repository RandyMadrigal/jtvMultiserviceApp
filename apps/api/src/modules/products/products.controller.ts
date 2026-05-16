import type { Response } from "express";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import type { UploadRequest } from "@/shared/middleware/upload.middleware";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.service";

type Req = AuthRequest & UploadRequest;

export const list = asyncHandler(async (req: Req, res: Response) => {
  const page     = Number(req.query.page)     || 1;
  const limit    = Number(req.query.limit)    || 20;
  const search   = (req.query.search   as string | undefined) ?? undefined;
  const category = (req.query.category as string | undefined) ?? undefined;
  const status   = (req.query.status   as string | undefined) ?? undefined;

  res.json(await listProducts({ page, limit, search, category, status }));
});

export const get = asyncHandler(async (req: Req, res: Response) => {
  res.json(await getProduct(req.params.id as string));
});

export const create = asyncHandler(async (req: Req, res: Response) => {
  res.status(201).json(
    await createProduct(req.body, req.adminId!, req.uploadedImages ?? []),
  );
});

export const update = asyncHandler(async (req: Req, res: Response) => {
  res.json(
    await updateProduct(req.params.id as string, req.body, req.uploadedImages),
  );
});

export const remove = asyncHandler(async (req: Req, res: Response) => {
  await deleteProduct(req.params.id as string);
  res.status(204).send();
});
