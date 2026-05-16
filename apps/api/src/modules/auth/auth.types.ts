import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Solo el ID del admin — el email no se incluye para minimizar exposición en logs/herramientas
export type AuthTokenPayload = {
  sub: string;
};
