import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const provided = req.headers["x-request-id"] as string | undefined;
  const id = (provided && UUID_RE.test(provided)) ? provided : randomUUID();
  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
}
