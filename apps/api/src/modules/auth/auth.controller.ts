import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AdminModel } from "@/modules/admin/admin.model";
import { TokenBlacklist } from "./token-blacklist.model";
import { login, refreshAccessToken, revokeRefreshToken } from "./auth.service";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";

const COOKIE_NAME = "refreshToken";

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge:   7 * 24 * 60 * 60 * 1000,
  path:     "/api/auth",
};

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { accessToken, refreshToken } = await login(req.body);
    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (!token) {
      res.status(401).json({ error: "Refresh token no encontrado" });
      return;
    }
    const accessToken = await refreshAccessToken(token);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Revocar refresh token
    const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (refreshToken) await revokeRefreshToken(refreshToken);

    // 2. Blacklistear el access token hasta que expire naturalmente
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const accessToken = authHeader.slice(7);
      const payload = jwt.decode(accessToken) as JwtPayload | null;
      if (payload?.exp) {
        // Ignora si ya está en la blacklist (duplicate key)
        await TokenBlacklist.create({
          token:     accessToken,
          expiresAt: new Date(payload.exp * 1000),
        }).catch(() => null);
      }
    }

    res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    next(err);
  }
}

export async function meHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const admin = await AdminModel.findById(req.adminId).select("-password").lean();
    if (!admin) {
      res.status(401).json({ error: "Admin no encontrado" });
      return;
    }
    res.json(admin);
  } catch (err) {
    next(err);
  }
}
