import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import type { AuthRequest } from "@/shared/middleware/auth.middleware";
import type { CreateAdminDto } from "./admin.types";

export async function createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateAdminDto;
    const hash = bcrypt.hashSync(dto.password, 12);
    const admin = await AdminModel.create({ email: dto.email, password: hash });
    res.status(201).json({ id: admin._id, email: admin.email });
  } catch (e) {
    next(e);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const admin = await AdminModel.findById(req.adminId).select("-password");
    if (!admin) { res.status(404).json({ error: "Admin no encontrado" }); return; }
    res.json(admin);
  } catch (e) {
    next(e);
  }
}
