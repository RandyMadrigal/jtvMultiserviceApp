export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
    // Mantiene el stack trace correcto en V8
    Error.captureStackTrace(this, this.constructor);
  }
}
