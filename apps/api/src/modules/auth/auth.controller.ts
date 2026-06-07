import type { Request, Response } from "express";
import { AdminModel } from "@/modules/admin/admin.model";
import {
  login, verifyOtp, resendOtpPublic, forgotPassword, resetPassword,
  refreshAccessToken, revokeRefreshToken, revokeAccessToken, REFRESH_TOKEN_TTL_MS,
} from "./auth.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
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

// Reenvío de OTP desde la página de login (sin autenticación)
export const resendOtpPublicHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendOtpDto;
  await resendOtpPublic(email);
  res.json({ message: "Si la cuenta existe y no está verificada, se enviará un nuevo código." });
});

export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ForgotPasswordDto;
  await forgotPassword(email);
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
  if (refreshToken) await revokeRefreshToken(refreshToken);

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.slice(7);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await revokeAccessToken(accessToken, expiresAt);
  }

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
