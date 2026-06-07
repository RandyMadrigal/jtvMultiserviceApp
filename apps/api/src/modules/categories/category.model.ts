import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true, versionKey: false },
);

export type CategoryDoc = mongoose.InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};
export const CategoryModel = mongoose.model("Category", categorySchema);
