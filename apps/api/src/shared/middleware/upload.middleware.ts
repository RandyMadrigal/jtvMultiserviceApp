import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "@/shared/storage/cloudinary";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error("Solo se permiten imágenes (jpeg, png, webp, gif)"), { status: 400 }));
  },
});

export const parseImageField = multerInstance.single("image");

export async function uploadToCloudinary(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.file) return next();

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "jtv-products", resource_type: "image" },
          (err, data) => {
            if (err || !data) reject(err ?? new Error("Cloudinary upload failed"));
            else resolve({ secure_url: data.secure_url, public_id: data.public_id });
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    req.body.image_url = result.secure_url;
    req.body.image_public_id = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
}
