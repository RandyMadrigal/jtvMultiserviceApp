import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { validateObjectId } from "@/shared/middleware/validateObjectId.middleware";
import { parseImageFields, uploadToCloudinary } from "@/shared/middleware/upload.middleware";
import { productSchema, updateProductSchema } from "./products.types";
import { list, get, create, update, remove } from "./products.controller";

export const productsRouter = Router();

// Público — el catálogo lee productos sin autenticación
productsRouter.get("/", list);
productsRouter.get("/:id", validateObjectId(), get);

// Admin — JWT + subida de imágenes múltiples opcional
productsRouter.post(
  "/",
  requireAuth,
  parseImageFields,
  uploadToCloudinary,
  validate(productSchema),
  create,
);

productsRouter.put(
  "/:id",
  requireAuth,
  validateObjectId(),
  parseImageFields,
  uploadToCloudinary,
  validate(updateProductSchema),
  update,
);

productsRouter.delete("/:id", requireAuth, validateObjectId(), remove);
