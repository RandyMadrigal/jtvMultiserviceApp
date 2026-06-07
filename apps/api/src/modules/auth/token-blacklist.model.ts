import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token:     { type: String, required: true, unique: true },
  expiresAt: { type: Date,   required: true },
}, { versionKey: false });

// MongoDB elimina el documento automáticamente cuando el token expira
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
