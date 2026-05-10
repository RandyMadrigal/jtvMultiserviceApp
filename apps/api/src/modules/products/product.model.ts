import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true, maxlength: 120 },
    description:      { type: String, default: "", maxlength: 500 },
    category:         { type: String, required: true, trim: true, maxlength: 80 },
    image_url:        { type: String, default: "" },
    image_public_id:  { type: String, default: "" },
    status: {
      type: String,
      enum: ["disponible", "agotado", "promocion"],
      default: "disponible",
    },
  },
  { timestamps: true },
);

export type ProductDoc = mongoose.InferSchemaType<typeof productSchema> & { _id: mongoose.Types.ObjectId };
export const ProductModel = mongoose.model("Product", productSchema);
