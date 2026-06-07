import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AdminModel } from "@/modules/admin/admin.model";
import { RefreshToken } from "./refresh-token.model";
import { TokenBlacklist } from "./token-blacklist.model";
import { OtpModel } from "./otp.model";
import { PasswordReset } from "./password-reset.model";
import { sendPasswordResetEmail, sendOtpEmail } from "@/shared/utils/email";
import { env } from "@/shared/config/env";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";
import { hashOtp } from "@/shared/utils/crypto";
import type { LoginDto, VerifyOtpDto } from "./auth.types";

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

// Hash bcrypt válido (cost 12) usado solo para igualación de tiempo en login.
// Cuando el email no existe, bcrypt.compare corre igual que con un hash real,
// eliminando el timing oracle que permitiría enumerar emails válidos.
const DUMMY_HASH = "$2b$12$AAAAAAAAAAAAAAAAAAAAAAbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

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
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });
  return token;
}

export async function login(
  dto: LoginDto,
): Promise<{ accessToken: string; refreshToken: string }> {
  const admin = await AdminModel.findOne({ email: dto.email }).select("+password");

  // Siempre ejecutar bcrypt aunque el admin no exista — previene timing oracle
  const passwordMatch = await bcrypt.compare(dto.password, admin?.password ?? DUMMY_HASH)
    .catch(() => false);

  if (!admin || !passwordMatch) {
    throw new AppError(401, "Credenciales inválidas");
  }

  if (!admin.verified) {
    throw new AppError(403, "Debes verificar tu correo antes de iniciar sesión", "EMAIL_NOT_VERIFIED");
  }

  const accessToken  = generateAccessToken(admin._id.toString());
  const refreshToken = await createRefreshToken(admin._id.toString());

  return { accessToken, refreshToken };
}

export async function verifyOtp(dto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
  const codeHash = hashOtp(dto.otp);

  // findOneAndDelete atómico: previene race condition entre requests concurrentes
  const otp = await OtpModel.findOneAndDelete({
    email:    dto.email.toLowerCase(),
    codeHash,
  });

  if (!otp || otp.expiresAt < new Date()) {
    throw new AppError(400, "Código inválido o expirado");
  }

  const admin = await AdminModel.findOneAndUpdate(
    { email: dto.email.toLowerCase() },
    { $set: { verified: true } },
    { new: true },
  );
  if (!admin) throw new AppError(404, "Cuenta no encontrada");

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

  if (stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token expirado");
  }

  const admin = await AdminModel.findById(stored.adminId).lean();
  if (!admin) {
    throw new AppError(401, "Admin no encontrado");
  }

  const adminId         = admin._id.toString();
  const accessToken     = generateAccessToken(adminId);
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

export async function revokeAccessToken(token: string, expiresAt: Date): Promise<void> {
  await TokenBlacklist.create({ token, expiresAt }).catch(() => null);
}

export async function resendOtpPublic(email: string): Promise<void> {
  const admin = await AdminModel.findOne({ email: email.toLowerCase() })
    .select("verified").lean();
  if (!admin || admin.verified) return;

  const code     = String(crypto.randomInt(100_000, 1_000_000));
  const codeHash = hashOtp(code);

  await OtpModel.deleteMany({ email: email.toLowerCase() });
  await OtpModel.create({
    email:     email.toLowerCase(),
    codeHash,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
  await sendOtpEmail(email, code).catch(() => null);
}

export async function forgotPassword(email: string): Promise<void> {
  const admin = await AdminModel.findOne({ email: email.toLowerCase() })
    .select("_id email").lean();

  if (!admin) return; // Silencioso — no revelar si el email existe

  await PasswordReset.deleteMany({ adminId: admin._id });

  const rawToken  = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await PasswordReset.create({
    tokenHash,
    adminId:   admin._id,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
  });

  const resetUrl = `${env.APP_URL}/admin/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail(admin.email, resetUrl).catch((err) => {
    logger.error({ email: admin.email, err }, "Error al enviar email de restablecimiento");
  });
}

export async function resetPassword(rawToken: string, newPassword: string): Promise<void> {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // findOneAndDelete atómico — el token solo puede usarse una vez
  const record = await PasswordReset.findOneAndDelete({ tokenHash });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError(400, "El enlace es inválido o ha expirado");
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await AdminModel.updateOne({ _id: record.adminId }, { $set: { password: hash, verified: true } });

  // Invalida todas las sesiones activas tras el cambio de contraseña
  await RefreshToken.deleteMany({ adminId: record.adminId });

  logger.info({
    audit:  true,
    action: "auth.password_reset",
    target: record.adminId,
  }, "Contraseña restablecida via enlace de reset");
}
