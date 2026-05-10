import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "@/shared/config/env";
import { errorMiddleware } from "@/shared/middleware/error.middleware";
import { authRouter } from "@/modules/auth/auth.routes";
import { productsRouter } from "@/modules/products/products.routes";
import { adminRouter } from "@/modules/admin/admin.routes";

const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Global rate limit ────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: { error: "Demasiadas solicitudes. Intenta más tarde." },
  }),
);

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorMiddleware);

export { app };
