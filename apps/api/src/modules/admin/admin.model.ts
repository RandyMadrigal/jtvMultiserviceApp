import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    isRoot:   { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    // Los access tokens emitidos antes de esta fecha se rechazan (se fija al restablecer la contraseña)
    passwordChangedAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
);

export type AdminDoc = mongoose.InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };
export const AdminModel = mongoose.model("Admin", adminSchema);
