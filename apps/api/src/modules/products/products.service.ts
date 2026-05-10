import { ProductModel } from "./product.model";
import { cloudinary } from "@/shared/storage/cloudinary";
import type { ImageItem } from "@/shared/middleware/upload.middleware";
import type { ProductDto } from "./products.types";

const POPULATE_CATEGORY   = { path: "category",  select: "name _id" };
const POPULATE_CREATED_BY = { path: "createdBy", select: "email" };

export async function listProducts() {
  return ProductModel.find()
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_CREATED_BY)
    .sort({ createdAt: -1 })
    .lean();
}

export async function getProduct(id: string) {
  const doc = await ProductModel.findById(id)
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_CREATED_BY)
    .lean();
  if (!doc) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  return doc;
}

export async function createProduct(dto: ProductDto, adminId: string, images: ImageItem[]) {
  const doc = await ProductModel.create({ ...dto, createdBy: adminId, images });
  return (await doc.populate([POPULATE_CATEGORY, POPULATE_CREATED_BY])).toObject();
}

export async function updateProduct(
  id: string,
  dto: Partial<ProductDto>,
  newImages?: ImageItem[],
) {
  const existing = await ProductModel.findById(id);
  if (!existing) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });

  // Si llegan imágenes nuevas, elimina las anteriores de Cloudinary y reemplaza
  const updateData: Partial<ProductDto> & { images?: ImageItem[] } = { ...dto };
  if (newImages && newImages.length > 0) {
    await Promise.all(
      (existing.images as ImageItem[]).map((img) =>
        cloudinary.uploader.destroy(img.public_id),
      ),
    );
    updateData.images = newImages;
  }

  const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate(POPULATE_CATEGORY)
    .populate(POPULATE_CREATED_BY)
    .lean();
  return updated!;
}

export async function deleteProduct(id: string) {
  const doc = await ProductModel.findByIdAndDelete(id).lean();
  if (!doc) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });

  // Elimina todas las imágenes asociadas de Cloudinary
  if (doc.images?.length) {
    await Promise.all(
      (doc.images as ImageItem[]).map((img) =>
        cloudinary.uploader.destroy(img.public_id),
      ),
    );
  }
}
