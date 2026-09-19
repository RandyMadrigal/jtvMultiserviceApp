import crypto from "crypto";

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

// Los refresh tokens se guardan con hash: una filtración de la base de datos no da sesiones utilizables.
// SHA-256 sin sal es suficiente porque el token ya es aleatorio de 512 bits.
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
