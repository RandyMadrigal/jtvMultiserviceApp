import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", maxlength: 200 },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

export type CategoryDoc = mongoose.InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};
export const CategoryModel = mongoose.model("Category", categorySchema);
