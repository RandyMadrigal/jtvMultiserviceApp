import { z } from "zod";

export const categorySchema = z.object({
  name:        z.string().min(1, "El nombre es requerido").max(80),
  description: z.string().max(200).default(""),
});

export type CategoryDto = z.infer<typeof categorySchema>;
