import { z } from "zod";

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type CreateAdminDto = z.infer<typeof createAdminSchema>;
