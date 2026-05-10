import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { AdminModel } from "./admin.model";
import type { CreateAdminDto } from "./admin.types";

export async function listAdmins(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const admins = await AdminModel.find()
      .select("-password")
      .sort({ createdAt: 1 })
      .lean();
    res.json(admins);
  } catch (e) {
    next(e);
  }
}

export async function createAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log(req.body);
  try {
    const dto = req.body as CreateAdminDto;
    const hash = bcrypt.hashSync(dto.password, 12);
    const admin = await AdminModel.create({ email: dto.email, password: hash });
    res.status(201).json({
      id: admin._id,
      email: admin.email,
      msg: "Admin created successfully",
    });
  } catch (e) {
    next(e);
  }
}
