import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "@/shared/config/env";
import { TokenBlacklist } from "@/modules/auth/token-blacklist.model";

export interface AuthRequest extends Request {
  adminId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token = header.slice(7);
  try {
    // 1. Verificar firma y expiración del JWT
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // 2. Verificar que el token no fue revocado (sesión cerrada)
    const revoked = await TokenBlacklist.exists({ token });
    if (revoked) {
      res.status(401).json({ error: "La sesión fue cerrada. Inicia sesión nuevamente." });
      return;
    }

    req.adminId = payload.sub as string;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
