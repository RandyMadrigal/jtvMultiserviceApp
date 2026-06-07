import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AdminModel } from "@/modules/admin/admin.model";
import {
  login, verifyOtp, resendOtpPublic, forgotPassword, resetPassword,
  refreshAccessToken, revokeRefreshToken, revokeAccessToken, REFRESH_TOKEN_TTL_MS,
} from "./auth.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { logger } from "@/shared/utils/logger";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import type { ResendOtpDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.types";

const COOKIE_NAME = "refreshToken";

function buildCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure:   isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge:   REFRESH_TOKEN_TTL_MS,
    path:     "/api/auth",
  };
}

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await login(req.body);
  res.cookie(COOKIE_NAME, refreshToken, buildCookieOptions());
  res.json({ accessToken });
});

export const verifyOtpHandler = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await verifyOtp(req.body);
  res.cookie(COOKIE_NAME, refreshToken, buildCookieOptions());
  res.json({ accessToken });
});

export const resendOtpPublicHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendOtpDto;
  await resendOtpPublic(email);
  logger.info({
    audit:  true,
    action: "auth.otp_resend",
    email,
    ip:    req.ip,
    reqId: req.requestId,
  }, "Reenvío de OTP solicitado");
  res.json({ message: "Si la cuenta existe y no está verificada, se enviará un nuevo código." });
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordDto;
  await forgotPassword(email);
  logger.info({
    audit:  true,
    action: "auth.forgot_password",
    email,
    ip:    req.ip,
    reqId: req.requestId,
  }, "Reset de contraseña solicitado");
  // Respuesta siempre igual — no revelar si el email está registrado
  res.json({ message: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña." });
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body as ResetPasswordDto;
  await resetPassword(token, password);
  res.json({ message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const oldToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!oldToken) {
    res.status(401).json({ error: "Refresh token no encontrado" });
    return;
  }

  const { accessToken, newRefreshToken } = await refreshAccessToken(oldToken);
  res.cookie(COOKIE_NAME, newRefreshToken, buildCookieOptions());
  res.json({ accessToken });
});

export const logoutHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  const authHeader   = req.headers.authorization;

  const revokeAccess = (): Promise<void> => {
    if (!authHeader?.startsWith("Bearer ")) return Promise.resolve();
    const accessToken = authHeader.slice(7);
    const decoded   = jwt.decode(accessToken) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);
    return revokeAccessToken(accessToken, expiresAt);
  };

  // allSettled: la cookie se limpia aunque la DB falle en revocar
  await Promise.allSettled([
    refreshToken ? revokeRefreshToken(refreshToken) : Promise.resolve(),
    revokeAccess(),
  ]);

  res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
  res.json({ message: "Sesión cerrada correctamente" });
});

export const meHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await AdminModel.findById(req.adminId).select("-password").lean();
  if (!admin) {
    res.status(404).json({ error: "Admin no encontrado" });
    return;
  }
  res.json(admin);
});
