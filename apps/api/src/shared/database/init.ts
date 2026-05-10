import bcrypt from "bcryptjs";
import { AdminModel } from "@/modules/admin/admin.model";
import { env } from "@/shared/config/env";

export async function initDefaultAdmin(): Promise<void> {
  const count = await AdminModel.countDocuments();

  if (count > 0) {
    console.log("Base de datos: ya existe un administrador, continuando...");
    return;
  }

  const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, 12);
  await AdminModel.create({ email: env.ADMIN_EMAIL, password: hash });

  console.log(`Admin por defecto creado → email: ${env.ADMIN_EMAIL}`);
}
