import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function validateObjectId(param = "id") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    next();
  };
}
