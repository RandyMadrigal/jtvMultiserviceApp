import { app } from "./app";
import { env } from "@/shared/config/env";
import { connectDb, disconnectDb } from "@/shared/database/db";
import { initDefaultAdmin } from "@/shared/database/init";
import { logger } from "@/shared/utils/logger";
import type { Server } from "http";

async function main(): Promise<void> {
  await connectDb();
  await initDefaultAdmin();

  const server: Server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "JTV API iniciada");
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  async function shutdown(signal: string): Promise<void> {
    logger.info({ signal }, "Señal de cierre recibida, cerrando servidor...");

    server.close(async () => {
      logger.info("Servidor HTTP cerrado");
      try {
        await disconnectDb();
        logger.info("Conexión MongoDB cerrada");
        process.exit(0);
      } catch (err) {
        logger.error({ err }, "Error al cerrar MongoDB");
        process.exit(1);
      }
    });

    // Forzar cierre si tarda más de 10 segundos
    setTimeout(() => {
      logger.error("Timeout al cerrar, forzando salida");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
  });

  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception — cerrando proceso");
    shutdown("uncaughtException").catch(() => process.exit(1));
  });
}

main().catch((err) => {
  logger.error({ err }, "Error crítico al iniciar el servidor");
  process.exit(1);
});
