import mongoose from "mongoose";
import { env } from "@/shared/config/env";

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
