import multer, { MulterError } from "multer";
import type { Request, Response, NextFunction } from "express";
import { cloudinary } from "@/shared/storage/cloudinary";

const MAX_FILES    = 10;
const MAX_SIZE_MB  = 10;
const MAX_SIZE_B   = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface ImageItem {
  url:        string;
  public_id:  string;
}

// Extiende Request para llevar las imágenes subidas a Cloudinary
export interface UploadRequest extends Request {
  uploadedImages?: ImageItem[];
}

// ── Multer ─────────────────────────────────────────────────────────────────────
const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_SIZE_B,   // 10 MB por archivo
    files:    MAX_FILES,    // máx. 10 archivos por petición
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error("Solo se permiten imágenes (jpeg, png, webp, gif)"), { status: 400 }));
  },
});

// Envuelve multer.array para capturar MulterError antes de llegar al handler global
export function parseImageFields(req: Request, res: Response, next: NextFunction): void {
  multerInstance.array("images", MAX_FILES)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof MulterError) {
      const messages: Record<string, string> = {
        LIMIT_FILE_SIZE:       `Cada imagen debe pesar menos de ${MAX_SIZE_MB} MB. Reduce el tamaño y vuelve a intentarlo.`,
        LIMIT_FILE_COUNT:      `Puedes subir máximo ${MAX_FILES} imágenes por vez.`,
        LIMIT_UNEXPECTED_FILE: "Campo de archivo no esperado. Usa el campo 'images'.",
      };
      const msg = messages[err.code] ?? `Error al procesar el archivo: ${err.message}`;
      return next(Object.assign(new Error(msg), { status: 400 }));
    }

    next(err);
  });
}

// ── Cloudinary ─────────────────────────────────────────────────────────────────
function uploadOneFile(buffer: Buffer): Promise<ImageItem> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        "jtv-products",
        resource_type: "image",
        width:         1280,
        crop:          "limit",
        quality:       "auto:good",
        fetch_format:  "auto",
      },
      (err, data) => {
        if (err || !data) { reject(err ?? new Error("Cloudinary upload failed")); return; }
        resolve({
          url:        data.secure_url.replace("/upload/", "/upload/q_auto,f_auto,w_1280,c_limit/"),
          public_id:  data.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

// Sube todos los archivos a Cloudinary en paralelo
export async function uploadToCloudinary(
  req: UploadRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) return next();

  try {
    req.uploadedImages = await Promise.all(files.map((f) => uploadOneFile(f.buffer)));
    next();
  } catch (err) {
    next(err);
  }
}
