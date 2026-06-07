import bcrypt from "bcryptjs";
import { AdminModel } from "@/modules/admin/admin.model";
import { env } from "@/shared/config/env";
import { logger } from "@/shared/utils/logger";

export async function initDefaultAdmin(): Promise<void> {
  // Verificar existencia primero para evitar el costo de bcrypt (cost 12 ≈ 300 ms) en cada arranque
  const existing = await AdminModel.findOne({ email: env.ADMIN_EMAIL }).select("_id isRoot verified").lean();

  if (existing) {
    // Garantiza isRoot y verified en documentos creados antes de que existieran estos campos
    const updates: Record<string, boolean> = {};
    if (!existing.isRoot)   updates.isRoot   = true;
    if (!existing.verified) updates.verified = true;
    if (Object.keys(updates).length > 0) {
      await AdminModel.updateOne({ _id: existing._id }, { $set: updates });
    }
    logger.info("Admin por defecto ya existe, continuando...");
    return;
  }

  const hash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  // Upsert atómico — maneja race condition si múltiples instancias arrancan en paralelo
  await AdminModel.findOneAndUpdate(
    { email: env.ADMIN_EMAIL },
    { $setOnInsert: { email: env.ADMIN_EMAIL, password: hash, isRoot: true, verified: true } },
    { upsert: true, new: false },
  );
  logger.info({ email: env.ADMIN_EMAIL }, "Admin por defecto creado");
}
