import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import type { CreateAdminDto } from "./admin.types";

export async function listAdmins() {
  // I-10: Limitar a 100 documentos para evitar respuestas sin cota
  return AdminModel.find().select("-password").sort({ createdAt: 1 }).limit(100).lean();
}

export async function createAdmin(dto: CreateAdminDto) {
  const hash  = await bcrypt.hash(dto.password, 12);
  const admin = await AdminModel.create({ email: dto.email, password: hash });
  // I-3b: Retornar _id en lugar de id para ser consistente con listAdmins que devuelve _id
  return { _id: admin._id, email: admin.email, createdAt: admin.createdAt };
}
