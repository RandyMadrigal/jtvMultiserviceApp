import { Router } from "express";
import { requireAuth } from "@/shared/middleware/auth.middleware";
import { validate } from "@/shared/middleware/validate.middleware";
import { parseImageFields, uploadToCloudinary } from "@/shared/middleware/upload.middleware";
import { productSchema } from "./products.types";
import { list, get, create, update, remove } from "./products.controller";

export const productsRouter = Router();

// Público — el catálogo lee productos sin autenticación
productsRouter.get("/", list);
productsRouter.get("/:id", get);

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
  parseImageFields,
  uploadToCloudinary,
  validate(productSchema.partial()),
  update,
);

productsRouter.delete("/:id", requireAuth, remove);
