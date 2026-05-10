import type { Request, Response, NextFunction } from "express";
import { login } from "./auth.service";

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = await login(req.body);
    res.json({ token });
  } catch (err) {
    next(err);
  }
}
