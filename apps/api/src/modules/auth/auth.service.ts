import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AdminModel } from "@/modules/admin/admin.model";
import { RefreshToken } from "./refresh-token.model";
import { env } from "@/shared/config/env";
import type { LoginDto } from "./auth.types";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function generateAccessToken(adminId: string, email: string): string {
  return jwt.sign(
    { sub: adminId, email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
}

async function generateRefreshToken(adminId: string): Promise<string> {
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

  if (!admin || !bcrypt.compareSync(dto.password, admin.password)) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  const accessToken  = generateAccessToken(admin._id.toString(), admin.email);
  const refreshToken = await generateRefreshToken(admin._id.toString());

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const stored = await RefreshToken.findOne({ token: refreshToken }).lean();
  if (!stored) {
    throw Object.assign(new Error("Refresh token inválido o expirado"), { status: 401 });
  }

  const admin = await AdminModel.findById(stored.adminId).lean();
  if (!admin) {
    throw Object.assign(new Error("Admin no encontrado"), { status: 401 });
  }

  return generateAccessToken(admin._id.toString(), admin.email);
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await RefreshToken.deleteOne({ token });
}
