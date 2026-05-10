import type { Request, Response, NextFunction } from "express";
import { login, refreshAccessToken, revokeRefreshToken } from "./auth.service";

const COOKIE_NAME = "refreshToken";

const cookieOptions = {
  httpOnly: true,                                          // invisible para JavaScript
  secure:   process.env.NODE_ENV === "production",         // HTTPS solo en producción
  sameSite: (process.env.NODE_ENV === "production"
    ? "none"
    : "lax") as "none" | "lax",
  maxAge:   7 * 24 * 60 * 60 * 1000,                     // 7 días en ms
  path:     "/api/auth",                                   // cookie solo va a /api/auth/*
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
    const token = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (token) await revokeRefreshToken(token);

    res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    next(err);
  }
}
