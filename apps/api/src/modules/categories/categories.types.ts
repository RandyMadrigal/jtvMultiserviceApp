import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(80),
});

export type CategoryDto = z.infer<typeof categorySchema>;
