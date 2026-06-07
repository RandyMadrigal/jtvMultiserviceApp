import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  adminId:   { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  expiresAt: { type: Date, required: true },
}, { versionKey: false });

// MongoDB elimina el documento automáticamente al expirar
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
passwordResetSchema.index({ adminId: 1 });

export const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);
