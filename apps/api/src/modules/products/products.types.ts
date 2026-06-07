import { z } from "zod";
import mongoose from "mongoose";

export const productSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(600).default(""),
  category: z.string().refine(
    (v) => mongoose.isValidObjectId(v),
    "La categoría debe ser un ID válido",
  ),
  status: z.enum(["disponible", "agotado", "promocion"]).default("disponible"),
});

export const updateProductSchema = productSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Se requiere al menos un campo para actualizar",
  });

export type ProductDto = z.infer<typeof productSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
