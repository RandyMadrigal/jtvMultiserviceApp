import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AdminModel } from "@/modules/admin/admin.model";
import { RefreshToken } from "./refresh-token.model";
import { env } from "@/shared/config/env";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";
import type { LoginDto } from "./auth.types";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function generateAccessToken(adminId: string): string {
  return jwt.sign(
    { sub: adminId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
}

async function createRefreshToken(adminId: string): Promise<string> {
  const token = crypto.randomBytes(64).toString("hex");
  await RefreshToken.create({
    token,
    adminId,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });
  return token;
}

export async function login(
  dto: LoginDto,
): Promise<{ accessToken: string; refreshToken: string }> {
  const admin = await AdminModel.findOne({ email: dto.email }).select("+password");

  if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
    throw new AppError(401, "Credenciales inválidas");
  }

  const accessToken  = generateAccessToken(admin._id.toString());
  const refreshToken = await createRefreshToken(admin._id.toString());

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(
  oldToken: string,
): Promise<{ accessToken: string; newRefreshToken: string }> {
  // Elimina el token viejo atómicamente — si ya fue usado es un replay attack
  const stored = await RefreshToken.findOneAndDelete({ token: oldToken });

  if (!stored) {
    throw new AppError(401, "Refresh token inválido o expirado");
  }

  // Detectar replay: el token fue encontrado pero ya expiró en la DB
  if (stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token expirado");
  }

  const admin = await AdminModel.findById(stored.adminId).lean();
  if (!admin) {
    throw new AppError(401, "Admin no encontrado");
  }

  const adminId       = admin._id.toString();
  const accessToken   = generateAccessToken(adminId);
  const newRefreshToken = await createRefreshToken(adminId);

  return { accessToken, newRefreshToken };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await RefreshToken.deleteOne({ token });
}

export async function revokeAllAdminTokens(adminId: string): Promise<void> {
  const count = await RefreshToken.deleteMany({ adminId });
  logger.warn({ adminId, count: count.deletedCount }, "Todos los refresh tokens del admin revocados");
}
