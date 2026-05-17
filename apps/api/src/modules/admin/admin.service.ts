import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import { AppError } from "@/shared/errors/AppError";
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

export async function deleteAdmin(targetId: string, requesterId: string) {
  if (targetId === requesterId) {
    throw new AppError(400, "No puedes eliminar tu propia cuenta");
  }

  const target = await AdminModel.findById(targetId).lean();
  if (!target) throw new AppError(404, "Administrador no encontrado");
  if (target.isRoot) throw new AppError(400, "No se puede eliminar al administrador raíz");

  await AdminModel.deleteOne({ _id: targetId });
}
