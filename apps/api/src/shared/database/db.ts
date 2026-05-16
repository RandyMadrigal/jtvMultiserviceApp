import mongoose from "mongoose";
import { env } from "@/shared/config/env";
import { logger } from "@/shared/utils/logger";

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  logger.info({ host: mongoose.connection.host }, "MongoDB conectado");
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB desconectado");
}
