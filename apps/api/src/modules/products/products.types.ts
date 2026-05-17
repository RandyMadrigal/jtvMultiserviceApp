import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(600).default(""),
  category: z.string().min(1, "La categoría es requerida"),
  status: z.enum(["disponible", "agotado", "promocion"]).default("disponible"),
});

export type ProductDto = z.infer<typeof productSchema>;
