import { CategoryModel } from "./category.model";
import { ProductModel } from "@/modules/products/product.model";
import { AppError } from "@/shared/errors/AppError";
import type { CategoryDto } from "./categories.types";

// Solo se usa en endpoints de admin (autenticados)
const POPULATE_CREATED_BY = { path: "createdBy", select: "email" };

export async function listCategories() {
  // C-1: Endpoint público — no exponer email del admin (sin populate de createdBy)
  // I-10: Limitar a 500 documentos
  return CategoryModel.find()
    .select("name createdAt")
    .sort({ name: 1 })
    .limit(500)
    .lean();
}

export async function getCategory(id: string) {
  // I-3a: Consistente con listCategories — endpoint público, sin email del admin
  const doc = await CategoryModel.findById(id).select("name createdAt").lean();
  if (!doc) throw new AppError(404, "Categoría no encontrada");
  return doc;
}

export async function createCategory(dto: CategoryDto, adminId: string) {
  const doc = await CategoryModel.create({ ...dto, createdBy: adminId });
  return (await doc.populate(POPULATE_CREATED_BY)).toObject();
}

export async function updateCategory(id: string, dto: Partial<CategoryDto>) {
  await getCategory(id); // valida existencia antes del update

  const doc = await CategoryModel.findByIdAndUpdate(id, dto, {
    new: true,
    runValidators: true,
  })
    .populate(POPULATE_CREATED_BY)
    .lean();

  return doc!;
}

export async function deleteCategory(id: string) {
  await getCategory(id);

  const count = await ProductModel.countDocuments({ category: id });
  if (count > 0) {
    throw new AppError(
      409,
      `No se puede eliminar: ${count} producto(s) pertenecen a esta categoría`,
      "CATEGORY_HAS_PRODUCTS",
    );
  }

  await CategoryModel.findByIdAndDelete(id);
}
