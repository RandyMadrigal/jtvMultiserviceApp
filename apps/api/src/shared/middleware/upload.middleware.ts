import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "@/shared/storage/cloudinary";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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
          {
            folder:        "jtv-products",
            resource_type: "image",
            // Redimensiona al subir: máx 1280px, nunca escala hacia arriba
            width:  1280,
            crop:   "limit",
            // Compresión automática + conversión al formato más eficiente (WebP/AVIF)
            quality:      "auto:good",
            fetch_format: "auto",
          },
          (err, data) => {
            if (err || !data) reject(err ?? new Error("Cloudinary upload failed"));
            else resolve({ secure_url: data.secure_url, public_id: data.public_id });
          },
        );
        stream.end(req.file!.buffer);
      },
    );

    // Añade parámetros de entrega optimizada a la URL
    // q_auto: calidad automática | f_auto: WebP/AVIF según el navegador | w_1280: máx ancho
    req.body.image_url        = result.secure_url.replace("/upload/", "/upload/q_auto,f_auto,w_1280,c_limit/");
    req.body.image_public_id  = result.public_id;
    next();
  } catch (err) {
    next(err);
  }
}
