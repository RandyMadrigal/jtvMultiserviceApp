import { ProductModel } from "./product.model";
import { cloudinary } from "@/shared/storage/cloudinary";
import type { ProductDto } from "./products.types";

export async function listProducts() {
  return ProductModel.find().sort({ createdAt: -1 }).lean();
}

export async function getProduct(id: string) {
  const doc = await ProductModel.findById(id).lean();
  if (!doc) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  return doc;
}

export async function createProduct(dto: ProductDto) {
  const doc = await ProductModel.create(dto);
  return doc.toObject();
}

export async function updateProduct(id: string, dto: Partial<ProductDto>) {
  const existing = await ProductModel.findById(id);
  if (!existing) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });

  // Delete old Cloudinary image when it is being replaced
  if (
    dto.image_public_id &&
    existing.image_public_id &&
    dto.image_public_id !== existing.image_public_id
  ) {
    await cloudinary.uploader.destroy(existing.image_public_id);
  }

  const updated = await ProductModel.findByIdAndUpdate(id, dto, {
    new: true,
    runValidators: true,
  }).lean();
  return updated!;
}

export async function deleteProduct(id: string) {
  const doc = await ProductModel.findByIdAndDelete(id).lean();
  if (!doc) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });
  if (doc.image_public_id) {
    await cloudinary.uploader.destroy(doc.image_public_id);
  }
}
