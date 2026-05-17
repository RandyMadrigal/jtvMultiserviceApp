import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // I-2: Envolver en try/catch para pasar el error al middleware de errores en vez de dejar que se propague
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
