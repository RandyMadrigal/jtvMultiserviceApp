import crypto from "crypto";
import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import { OtpModel } from "@/modules/auth/otp.model";
import { sendOtpEmail } from "@/shared/utils/email";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";
import type { CreateAdminDto } from "./admin.types";

export async function listAdmins(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AdminModel.find().select("-password").sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
    AdminModel.countDocuments(),
  ]);
  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function createAdmin(dto: CreateAdminDto) {
  const hash  = await bcrypt.hash(dto.password, 12);
  const admin = await AdminModel.create({ email: dto.email, password: hash, verified: false });

  const code = String(crypto.randomInt(100_000, 1_000_000));
  await OtpModel.deleteMany({ email: dto.email });
  await OtpModel.create({ email: dto.email, code, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

  let emailSent = false;
  try {
    await sendOtpEmail(dto.email, code);
    emailSent = true;
  } catch (err) {
    logger.error({ email: dto.email, err }, "Error al enviar OTP al nuevo administrador");
  }

  return { _id: admin._id, email: admin.email, createdAt: admin.createdAt, emailSent };
}

export async function resendOtp(adminId: string) {
  const admin = await AdminModel.findById(adminId).select("email verified").lean();
  if (!admin) throw new AppError(404, "Administrador no encontrado");
  if (admin.verified) throw new AppError(400, "Este administrador ya está verificado");

  const code = String(crypto.randomInt(100_000, 1_000_000));
  await OtpModel.deleteMany({ email: admin.email });
  await OtpModel.create({ email: admin.email, code, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
  await sendOtpEmail(admin.email, code);
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
