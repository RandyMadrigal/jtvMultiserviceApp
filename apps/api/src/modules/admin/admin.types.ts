import { z } from "zod";

export const createAdminSchema = z.object({
  email: z.string().email("Debe ser un email válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
});

export type CreateAdminDto = z.infer<typeof createAdminSchema>;
