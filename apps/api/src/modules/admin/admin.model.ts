import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type AdminDoc = mongoose.InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };
export const AdminModel = mongoose.model("Admin", adminSchema);
