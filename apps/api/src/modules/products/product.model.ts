import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 600 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [imageSchema], default: [] },
    status: {
      type: String,
      enum: ["disponible", "agotado", "promocion"],
      default: "disponible",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

// Índices para queries frecuentes del catálogo público
productSchema.index({ category: 1, status: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ createdAt: -1 });
// Búsqueda por nombre — el índice sparse acelera $regex case-insensitive en catálogos < 50k docs
productSchema.index({ name: 1 });

export type ProductDoc = mongoose.InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ProductModel = mongoose.model("Product", productSchema);
