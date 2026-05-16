import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Eliminar el try/catch boilerplate en controllers async.
 * Express 4 no captura promesas rechazadas automáticamente.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
