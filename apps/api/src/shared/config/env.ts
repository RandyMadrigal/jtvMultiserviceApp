import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Security
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),

  // CORS — comma-separated list of allowed origins
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  // Database
  MONGODB_URI: z
    .string()
    .startsWith("mongodb")
    .min(1, "MONGODB_URI is required"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // Admin por defecto (solo se usa en el primer arranque, requerido)
  ADMIN_EMAIL:    z.string().email("ADMIN_EMAIL debe ser un email válido"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD debe tener al menos 8 caracteres"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
