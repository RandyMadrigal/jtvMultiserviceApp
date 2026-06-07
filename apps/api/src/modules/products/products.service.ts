import mongoose from "mongoose";
import { ProductModel } from "./product.model";
import { CategoryModel } from "@/modules/categories/category.model";
import { cloudinary } from "@/shared/storage/cloudinary";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";
import type { ImageItem } from "@/shared/middleware/upload.middleware";
import type { ProductDto } from "./products.types";

const POPULATE_CATEGORY   = { path: "category",  select: "name _id" };
// POPULATE_CREATED_BY solo se usa en endpoints de admin (autenticados)
const POPULATE_CREATED_BY = { path: "createdBy", select: "email" };

// Proyección para endpoints públicos: excluye createdBy, updatedAt y images.public_id
const PUBLIC_SELECT = {
  name: 1, description: 1, category: 1,
  "images.url": 1, status: 1, createdAt: 1,
} as const;

// Elimina public_id de las imágenes antes de devolver al cliente.
// El backend lo guarda en DB solo para gestionar Cloudinary internamente.
function sanitizeImages(doc: Record<string, unknown>): Record<string, unknown> {
  const imgs = doc.images as Array<{ url: string }> | undefined;
  return { ...doc, images: (imgs ?? []).map(({ url }) => ({ url })) };
}

export interface ProductListOptions {
  page?:     number;
  limit?:    number;
  search?:   string;
  category?: string;
  status?:   string;
}

export interface PaginatedProducts {
  items:      unknown[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// Escapa caracteres especiales de regex para evitar ReDoS
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listProducts(opts: ProductListOptions = {}): Promise<PaginatedProducts> {
  const page  = Math.max(1, opts.page  ?? 1);
  const limit = Math.min(50, Math.max(1, opts.limit ?? 20));

  const filter: Record<string, unknown> = {};

  // Validar que category sea un ObjectId válido antes de usarlo como filtro
  if (opts.category && mongoose.isValidObjectId(opts.category)) {
    filter.category = opts.category;
  }

  if (opts.status) filter.status = opts.status;

  if (opts.search?.trim()) {
    const escaped = escapeRegex(opts.search.trim());
    filter.name = { $regex: escaped, $options: "i" };
  }

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .select(PUBLIC_SELECT)
      .populate(POPULATE_CATEGORY)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProduct(id: string) {
  const doc = await ProductModel.findById(id)
    .select(PUBLIC_SELECT)
    .populate(POPULATE_CATEGORY)
    .lean();
  if (!doc) throw new AppError(404, "Producto no encontrado");
  return doc;
}

export async function createProduct(dto: ProductDto, adminId: string, images: ImageItem[]) {
  const categoryExists = await CategoryModel.exists({ _id: dto.category });
  if (!categoryExists) throw new AppError(404, "Categoría no encontrada");

  let doc;
  try {
    doc = await ProductModel.create({ ...dto, createdBy: adminId, images });
  } catch (err) {
    // I-4: Si la inserción en DB falla, limpiar las imágenes ya subidas a Cloudinary
    if (images.length > 0) {
      Promise.all(images.map((img) => cloudinary.uploader.destroy(img.public_id))).catch(
        (cleanupErr) => logger.error({ cleanupErr }, "Error al limpiar imágenes huérfanas de Cloudinary"),
      );
    }
    throw err;
  }
  const full = (await doc.populate([POPULATE_CATEGORY, POPULATE_CREATED_BY])).toObject();
  return sanitizeImages(full as Record<string, unknown>);
}

export async function updateProduct(
  id: string,
  dto: Partial<ProductDto>,
  newImages?: ImageItem[],
) {
  const existing = await ProductModel.findById(id);
  if (!existing) throw new AppError(404, "Producto no encontrado");

  // I-5: Validar que la categoría existe si se está cambiando
  if (dto.category) {
    const categoryExists = await CategoryModel.exists({ _id: dto.category });
    if (!categoryExists) throw new AppError(404, "Categoría no encontrada");
  }

  const replaceImages = newImages && newImages.length > 0;
  const oldImages     = replaceImages ? (existing.images as ImageItem[]) : [];

  // 1. Actualizar DB primero — si falla, Cloudinary no se toca
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { ...dto, ...(replaceImages && { images: newImages }) },
    { new: true, runValidators: true },
  )
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_CREATED_BY)
    .lean();

  if (!updated) throw new AppError(404, "Producto no encontrado");

  // 2. Limpiar Cloudinary solo después de que DB fue exitosa
  if (oldImages.length > 0) {
    Promise.all(oldImages.map((img) => cloudinary.uploader.destroy(img.public_id))).catch(
      (err) => logger.error({ productId: id, err }, "Error al limpiar imágenes de Cloudinary"),
    );
  }

  return sanitizeImages(updated as Record<string, unknown>);
}

export async function deleteProduct(id: string) {
  const doc = await ProductModel.findByIdAndDelete(id).lean();
  if (!doc) throw new AppError(404, "Producto no encontrado");

  // Fire-and-forget con logging — la DB ya está actualizada, el cleanup de Cloudinary es secundario
  if (doc.images?.length) {
    Promise.all(
      (doc.images as ImageItem[]).map((img) => cloudinary.uploader.destroy(img.public_id)),
    ).catch((err) =>
      logger.error({ productId: id, err }, "Error al eliminar imágenes de Cloudinary"),
    );
  }
}
