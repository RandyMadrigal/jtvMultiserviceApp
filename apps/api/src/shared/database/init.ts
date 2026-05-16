import bcrypt from "bcryptjs";
import { AdminModel } from "@/modules/admin/admin.model";
import { env } from "@/shared/config/env";
import { logger } from "@/shared/utils/logger";

export async function initDefaultAdmin(): Promise<void> {
  const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  // Upsert atómico — evita race condition si múltiples instancias arrancan simultáneamente
  const result = await AdminModel.findOneAndUpdate(
    { email: env.ADMIN_EMAIL },
    { $setOnInsert: { email: env.ADMIN_EMAIL, password: hash } },
    { upsert: true, new: false },
  );

  if (result === null) {
    logger.info({ email: env.ADMIN_EMAIL }, "Admin por defecto creado");
  } else {
    logger.info("Admin por defecto ya existe, continuando...");
  }
}
