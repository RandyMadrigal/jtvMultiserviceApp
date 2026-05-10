import { z } from "zod";

export const productSchema = z.object({
  name:            z.string().min(1).max(120),
  description:     z.string().max(500).default(""),
  category:        z.string().min(1).max(80),
  image_url:       z.string().default(""),
  image_public_id: z.string().default(""),
  status:          z.enum(["disponible", "agotado", "promocion"]).default("disponible"),
});

export type ProductDto = z.infer<typeof productSchema>;
