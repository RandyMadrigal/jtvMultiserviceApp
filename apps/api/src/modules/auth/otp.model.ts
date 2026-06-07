import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  code:      { type: String, required: true },
  expiresAt: { type: Date,   required: true },
});

// MongoDB elimina el documento automáticamente cuando expira
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1 });

export const OtpModel = mongoose.model("Otp", otpSchema);
