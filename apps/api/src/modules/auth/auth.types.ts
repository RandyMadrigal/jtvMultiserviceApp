import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp:   z.string().length(6).regex(/^\d{6}$/, "El código debe ser de 6 dígitos"),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  email: z.string().email(),
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

const passwordRules = z
  .string()
  .min(8,   "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña no puede superar 128 caracteres")
  .regex(/[A-Z]/,        "Debe contener al menos una letra mayúscula")
  .regex(/[0-9]/,        "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial");

export const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: passwordRules,
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

// Solo el ID del admin — el email no se incluye para minimizar exposición en logs/herramientas
export type AuthTokenPayload = {
  sub: string;
};
