import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AdminModel } from "@/modules/admin/admin.model";
import { TokenBlacklist } from "./token-blacklist.model";
import { login, refreshAccessToken, revokeRefreshToken } from "./auth.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";

const COOKIE_NAME = "refreshToken";

function buildCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure:   isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000,
    path:     "/api/auth",
  };
}

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await login(req.body);
  res.cookie(COOKIE_NAME, refreshToken, buildCookieOptions());
  res.json({ accessToken });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const oldToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!oldToken) {
    res.status(401).json({ error: "Refresh token no encontrado" });
    return;
  }

  const { accessToken, newRefreshToken } = await refreshAccessToken(oldToken);

  // Rotar cookie con el nuevo refresh token
  res.cookie(COOKIE_NAME, newRefreshToken, buildCookieOptions());
  res.json({ accessToken });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  // 1. Revocar refresh token
  const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (refreshToken) await revokeRefreshToken(refreshToken);

  // 2. Blacklistear el access token hasta que expire naturalmente
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.slice(7);
    const payload     = jwt.decode(accessToken) as JwtPayload | null;
    if (payload?.exp) {
      await TokenBlacklist.create({
        token:     accessToken,
        expiresAt: new Date(payload.exp * 1000),
      }).catch(() => null); // Ignorar duplicado si ya está en la blacklist
    }
  }

  res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
  res.json({ message: "Sesión cerrada correctamente" });
});

export const meHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await AdminModel.findById(req.adminId).select("-password").lean();
  if (!admin) {
    res.status(401).json({ error: "Admin no encontrado" });
    return;
  }
  res.json(admin);
});
