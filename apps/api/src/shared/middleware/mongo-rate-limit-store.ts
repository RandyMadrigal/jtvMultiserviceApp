import mongoose from "mongoose";
import type { Store, Options, ClientRateLimitInfo } from "express-rate-limit";

interface RateLimitDoc {
  key: string;
  hits: number;
  expiresAt: Date;
}

const rateLimitSchema = new mongoose.Schema<RateLimitDoc>({
  key:       { type: String, required: true, unique: true },
  hits:      { type: Number, default: 1 },
  expiresAt: { type: Date,   required: true },
});
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Reuse model across hot-reloads (tsx watch)
const RateLimitModel: mongoose.Model<RateLimitDoc> =
  (mongoose.models["_RateLimit"] as mongoose.Model<RateLimitDoc> | undefined) ??
  mongoose.model<RateLimitDoc>("_RateLimit", rateLimitSchema);

/**
 * MongoDB-backed store for express-rate-limit.
 * Works across multiple server instances and survives restarts.
 * No extra dependencies — uses the Mongoose connection already established.
 */
export class MongoRateLimitStore implements Store {
  private windowMs = 60_000;

  init(options: Options): void {
    this.windowMs = options.windowMs;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const now       = new Date();
    const expiresAt = new Date(Date.now() + this.windowMs);

    // Remove stale document if the TTL daemon (~60s cadence) hasn't cleaned it yet.
    await RateLimitModel.deleteOne({ key, expiresAt: { $lt: now } });

    const doc = await RateLimitModel.findOneAndUpdate(
      { key },
      {
        $inc:         { hits: 1 },
        $setOnInsert: { expiresAt }, // preserves window boundary on subsequent hits
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean<RateLimitDoc>();

    return {
      totalHits: doc?.hits ?? 1,
      resetTime: doc?.expiresAt ?? expiresAt,
    };
  }

  async decrement(key: string): Promise<void> {
    await RateLimitModel.updateOne({ key }, { $inc: { hits: -1 } });
  }

  async resetKey(key: string): Promise<void> {
    await RateLimitModel.deleteOne({ key });
  }
}
