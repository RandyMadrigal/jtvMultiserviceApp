import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Datos inválidos", details: err.flatten().fieldErrors });
    return;
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ?? "campo";
    res.status(409).json({ error: `Ya existe un registro con ese ${field}` });
    return;
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const message = err instanceof Error ? err.message : "Error interno del servidor";
  const status = (err as { status?: number }).status ?? 500;
  res.status(status).json({ error: message });
}
