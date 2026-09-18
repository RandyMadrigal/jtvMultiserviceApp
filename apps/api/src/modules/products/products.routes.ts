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

// Admin — JWT + subida de imágenes múltiples opcional.
// validate va ANTES de uploadToCloudinary: si el body es inválido no se sube nada a Cloudinary.
productsRouter.post(
  "/",
  requireAuth,
  parseImageFields,
  validate(productSchema),
  uploadToCloudinary,
  create,
);

productsRouter.put(
  "/:id",
  requireAuth,
  validateObjectId(),
  parseImageFields,
  validate(updateProductSchema),
  uploadToCloudinary,
  update,
);

productsRouter.delete("/:id", requireAuth, validateObjectId(), remove);
