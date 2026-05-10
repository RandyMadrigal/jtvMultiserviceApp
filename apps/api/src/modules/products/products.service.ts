import { ProductModel } from "./product.model";
import { cloudinary } from "@/shared/storage/cloudinary";
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

export async function createProduct(dto: ProductDto, adminId: string) {
  const doc = await ProductModel.create({ ...dto, createdBy: adminId });
  return (await doc.populate([POPULATE_CATEGORY, POPULATE_CREATED_BY])).toObject();
}

export async function updateProduct(id: string, dto: Partial<ProductDto>) {
  const existing = await ProductModel.findById(id);
  if (!existing) throw Object.assign(new Error("Producto no encontrado"), { status: 404 });

  if (
    dto.image_public_id &&
    existing.image_public_id &&
    dto.image_public_id !== existing.image_public_id
  ) {
    await cloudinary.uploader.destroy(existing.image_public_id as string);
  }

  const updated = await ProductModel.findByIdAndUpdate(id, dto, {
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
  if (doc.image_public_id) {
    await cloudinary.uploader.destroy(doc.image_public_id as string);
  }
}
