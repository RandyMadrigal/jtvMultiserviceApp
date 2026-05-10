import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { parseImageField, uploadToCloudinary } from "@/shared/middleware/upload.middleware";
import { productSchema } from "./products.types";
import { list, get, create, update, remove } from "./products.controller";

export const productsRouter = Router();

// Public — frontend reads products for the catalog
productsRouter.get("/", list);
productsRouter.get("/:id", get);

// Admin-only — JWT + optional image upload
productsRouter.post(
  "/",
  requireAuth,
  parseImageField,
  uploadToCloudinary,
  validate(productSchema),
  create,
);

productsRouter.put(
  "/:id",
  requireAuth,
  parseImageField,
  uploadToCloudinary,
  validate(productSchema.partial()),
  update,
);

productsRouter.delete("/:id", requireAuth, remove);
