import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { MongoRateLimitStore } from "@/shared/middleware/mongo-rate-limit-store";
import mongoose from "mongoose";
import { env } from "@/shared/config/env";
import { errorMiddleware } from "@/shared/middleware/error.middleware";
import { requestIdMiddleware } from "@/shared/middleware/requestId.middleware";
import { authRouter } from "@/modules/auth/auth.routes";
import { categoriesRouter } from "@/modules/categories/categories.routes";
import { productsRouter } from "@/modules/products/products.routes";
import { adminRouter } from "@/modules/admin/admin.routes";

const app = express();

// Necesario para que req.ip refleje el cliente real detrás del proxy de Vercel/nginx
app.set("trust proxy", 1);

// ── Request ID (debe ir primero para correlacionar todos los logs) ────────────
app.use(requestIdMiddleware);

// ── Health check ─────────────────────────────────────────────────────────────
//Si HEALTH_TOKEN está definida en env, requiere el header X-Health-Token para acceder
app.get("/health", async (_req, res) => {
  const dbHealthy = mongoose.connection.readyState === 1;
  res.status(dbHealthy ? 200 : 503).json({
    status:    dbHealthy ? "ok" : "degraded",
    db:        dbHealthy ? "ok" : "error",
    timestamp: new Date().toISOString(),
  });
});

// ── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:              ["'self'"],
        imgSrc:                  ["'self'", "https://res.cloudinary.com", "data:"],
        scriptSrc:               ["'self'"],
        styleSrc:                ["'self'", "'unsafe-inline'"],
        connectSrc:              ["'self'"],
        fontSrc:                 ["'self'"],
        objectSrc:               ["'none'"],
        frameSrc:                ["'none'"],
        upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
      },
    },
    // HSTS: fuerza HTTPS por 1 año en producción
    hsts: env.NODE_ENV === "production"
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Sin Origin = petición server-to-server (healthchecks, curl) — CORS no aplica
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Origen no permitido por CORS"));
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Global rate limit ────────────────────────────────────────────────────────
// Store en MongoDB: persiste entre reinicios y funciona con múltiples instancias.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    store: new MongoRateLimitStore("global"),
    message: { error: "Demasiadas solicitudes. Intenta más tarde." },
  }),
);

// ── Logging ──────────────────────────────────────────────────────────────────
// Token personalizado: incluye req.requestId en cada línea de log para correlación
morgan.token("req-id", (req) => (req as unknown as { requestId?: string }).requestId ?? "-");
app.use(
  morgan(
    env.NODE_ENV === "production"
      ? ':req-id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
      : ":req-id :method :url :status :response-time ms",
  ),
);

// ── Body + Cookie parsing ────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// ── NoSQL injection sanitization ─────────────────────────────────────────────
// Elimina operadores $ y . de los inputs antes de que lleguen a MongoDB
app.use(mongoSanitize());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/admin", adminRouter);

// ── Error handler (debe ser el último middleware) ────────────────────────────
app.use(errorMiddleware);

export { app };
