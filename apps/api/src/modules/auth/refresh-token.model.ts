import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token:    { type: String, required: true, unique: true },
  adminId:  { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  expiresAt:{ type: Date, required: true },
});

// MongoDB elimina el documento automáticamente cuando llega expiresAt
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// I-6: Índice en adminId para que deleteMany({ adminId }) sea eficiente
refreshTokenSchema.index({ adminId: 1 });

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
