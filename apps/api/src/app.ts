import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import { env } from "@/shared/config/env";
import { errorMiddleware } from "@/shared/middleware/error.middleware";
import { requestIdMiddleware } from "@/shared/middleware/requestId.middleware";
import { authRouter } from "@/modules/auth/auth.routes";
import { categoriesRouter } from "@/modules/categories/categories.routes";
import { productsRouter } from "@/modules/products/products.routes";
import { adminRouter } from "@/modules/admin/admin.routes";

const app = express();

// ── Request ID (debe ir primero para correlacionar todos los logs) ────────────
app.use(requestIdMiddleware);

// ── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        imgSrc:      ["'self'", "https://res.cloudinary.com", "data:"],
        scriptSrc:   ["'self'"],
        styleSrc:    ["'self'", "'unsafe-inline'"],
        connectSrc:  ["'self'"],
        fontSrc:     ["'self'"],
        objectSrc:   ["'none'"],
        frameSrc:    ["'none'"],
        upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
      },
    },
  }),
);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ── Global rate limit ────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Demasiadas solicitudes. Intenta más tarde." },
  }),
);

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Body + Cookie parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ── NoSQL injection sanitization ─────────────────────────────────────────────
// Elimina operadores $ y . de los inputs antes de que lleguen a MongoDB
app.use(mongoSanitize());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products",   productsRouter);
app.use("/api/admin",      adminRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", async (_req, res) => {
  const dbState   = mongoose.connection.readyState;
  const dbHealthy = dbState === 1;
  const checks    = {
    status:    dbHealthy ? "ok" : "degraded",
    db:        dbHealthy ? "ok" : "error",
    uptime:    Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
  res.status(dbHealthy ? 200 : 503).json(checks);
});

// ── Error handler (debe ser el último middleware) ────────────────────────────
app.use(errorMiddleware);

export { app };
