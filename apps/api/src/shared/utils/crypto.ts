import crypto from "crypto";

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}
