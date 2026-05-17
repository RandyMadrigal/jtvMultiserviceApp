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

export async function listProducts(opts: ProductListOptions = {}): Promise<PaginatedProducts> {
  const page  = Math.max(1, opts.page  ?? 1);
  const limit = Math.min(200, Math.max(1, opts.limit ?? 20));

  const filter: Record<string, unknown> = {};
  if (opts.category) filter.category = opts.category;
  if (opts.status)   filter.status   = opts.status;
  if (opts.search?.trim()) {
    // Usa full-text si el índice text existe, de lo contrario regex
    filter.$or = [
      { $text: { $search: opts.search } },
      { name: { $regex: opts.search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .select("name description category images status createdAt")
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
    .populate(POPULATE_CATEGORY)
    .lean();
  if (!doc) throw new AppError(404, "Producto no encontrado");
  return doc;
}

export async function createProduct(dto: ProductDto, adminId: string, images: ImageItem[]) {
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
  return (await doc.populate([POPULATE_CATEGORY, POPULATE_CREATED_BY])).toObject();
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

  // I-1: Comprobar que updated no es null antes de retornarlo
  if (!updated) throw new AppError(404, "Producto no encontrado");

  // 2. Limpiar Cloudinary solo después de que DB fue exitosa
  if (oldImages.length > 0) {
    Promise.all(oldImages.map((img) => cloudinary.uploader.destroy(img.public_id))).catch(
      (err) => logger.error({ productId: id, err }, "Error al limpiar imágenes de Cloudinary"),
    );
  }

  return updated;
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
