import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  codeHash:  { type: String, required: true }, // SHA-256 del código — nunca se guarda el código plano
  expiresAt: { type: Date,   required: true },
}, { versionKey: false });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, codeHash: 1 }); // índice compuesto para la query de verificación

export const OtpModel = mongoose.model("Otp", otpSchema);
