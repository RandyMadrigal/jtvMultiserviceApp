import type { Request, Response } from "express";
import { AdminModel } from "@/modules/admin/admin.model";
import { login, refreshAccessToken, revokeRefreshToken, revokeAccessToken, REFRESH_TOKEN_TTL_MS } from "./auth.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";

const COOKIE_NAME = "refreshToken";

function buildCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure:   isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge:   REFRESH_TOKEN_TTL_MS, // I-9: compartir TTL desde auth.service
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

export const logoutHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  // 1. Revocar refresh token
  const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (refreshToken) await revokeRefreshToken(refreshToken);

  // 2. Blacklistear el access token hasta que expire naturalmente
  // C-2: Usar el token ya verificado por requireAuth — no decodificar de nuevo con jwt.decode
  // M-10: Delegar al service en lugar de crear TokenBlacklist directamente
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.slice(7);
    // El token ya fue verificado por requireAuth; calcular expiresAt desde TTL de env
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await revokeAccessToken(accessToken, expiresAt);
  }

  res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
  res.json({ message: "Sesión cerrada correctamente" });
});

export const meHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const admin = await AdminModel.findById(req.adminId).select("-password").lean();
  if (!admin) {
    // I-3c: Token válido pero admin eliminado → 404, no 401
    res.status(404).json({ error: "Admin no encontrado" });
    return;
  }
  res.json(admin);
});
