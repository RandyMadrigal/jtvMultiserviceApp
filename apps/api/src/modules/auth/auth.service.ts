import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminModel } from "@/modules/admin/admin.model";
import { env } from "@/shared/config/env";
import type { LoginDto } from "./auth.types";

export async function login(dto: LoginDto): Promise<string> {
  const admin = await AdminModel.findOne({ email: dto.email }).select(
    "+password",
  );

  if (!admin || !bcrypt.compareSync(dto.password, admin.password)) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
}
