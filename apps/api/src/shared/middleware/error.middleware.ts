import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";
import { env } from "@/shared/config/env";

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // AppError — errores controlados de negocio
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code && { code: err.code }),
    });
    return;
  }

  // Zod — validación de inputs
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Datos inválidos",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // MongoDB duplicate key (ej: email duplicado)
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    const field =
      Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ??
      "campo";
    res.status(409).json({ error: `Ya existe un registro con ese ${field}` });
    return;
  }

  // Mongoose cast error (ej: ObjectId inválido)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  // Error genérico — logear y ocultar detalles en producción
  const message = err instanceof Error ? err.message : "Error interno del servidor";
  const status  = (err as { status?: number }).status ?? 500;

  if (status >= 500) {
    logger.error(
      {
        requestId: req.requestId,
        path:      req.path,
        method:    req.method,
        ...(err instanceof Error && { stack: err.stack }),
      },
      message,
    );
  }

  res.status(status).json({
    error: env.NODE_ENV === "production" && status >= 500
      ? "Error interno del servidor"
      : message,
    ...(env.NODE_ENV === "development" && err instanceof Error && { stack: err.stack }),
  });
}
