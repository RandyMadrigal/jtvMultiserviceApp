import mongoose from "mongoose";
import type { Store, Options, ClientRateLimitInfo } from "express-rate-limit";

interface RateLimitDoc {
  key: string;
  hits: number;
  expiresAt: Date;
}

const rateLimitSchema = new mongoose.Schema<RateLimitDoc>({
  key:       { type: String, required: true, unique: true },
  hits:      { type: Number, default: 0 }, // 0 + $inc(1) = 1 en el primer request
  expiresAt: { type: Date,   required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Reuse model across hot-reloads (tsx watch)
const RateLimitModel: mongoose.Model<RateLimitDoc> =
  (mongoose.models["_RateLimit"] as mongoose.Model<RateLimitDoc> | undefined) ??
  mongoose.model<RateLimitDoc>("_RateLimit", rateLimitSchema);

/**
 * MongoDB-backed store for express-rate-limit.
 * Cada instancia recibe un prefix único para aislar sus contadores
 * de los de otros limiters que comparten la misma colección.
 */
export class MongoRateLimitStore implements Store {
  private windowMs = 60_000;
  private readonly _prefix: string;

  constructor(prefix: string) {
    this._prefix = prefix;
  }

  // Clave con prefijo: "login:192.168.1.1", "pwd-reset:192.168.1.1", etc.
  private pk(key: string): string {
    return `${this._prefix}:${key}`;
  }

  init(options: Options): void {
    this.windowMs = options.windowMs;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const pk        = this.pk(key);
    const now       = new Date();
    const expiresAt = new Date(Date.now() + this.windowMs);

    // Elimina el documento si expiró antes de que el TTL daemon lo limpie
    await RateLimitModel.deleteOne({ key: pk, expiresAt: { $lt: now } });

    const doc = await RateLimitModel.findOneAndUpdate(
      { key: pk },
      {
        $inc:         { hits: 1 },
        $setOnInsert: { expiresAt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean<RateLimitDoc>();

    return {
      totalHits: doc?.hits ?? 1,
      resetTime: doc?.expiresAt ?? expiresAt,
    };
  }

  async decrement(key: string): Promise<void> {
    await RateLimitModel.updateOne({ key: this.pk(key) }, { $inc: { hits: -1 } });
  }

  async resetKey(key: string): Promise<void> {
    await RateLimitModel.deleteOne({ key: this.pk(key) });
  }
}
