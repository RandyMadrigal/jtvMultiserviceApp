import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import type { CreateAdminDto } from "./admin.types";

export async function listAdmins() {
  return AdminModel.find().select("-password").sort({ createdAt: 1 }).lean();
}

export async function createAdmin(dto: CreateAdminDto) {
  const hash  = await bcrypt.hash(dto.password, 12);
  const admin = await AdminModel.create({ email: dto.email, password: hash });
  return { id: admin._id, email: admin.email };
}
