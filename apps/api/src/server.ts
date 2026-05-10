import { app } from "./app";
import { env } from "@/shared/config/env";
import { connectDb } from "@/shared/database/db";

async function main(): Promise<void> {
  await connectDb();
  app.listen(env.PORT, () => {
    console.log(`JTV API running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
