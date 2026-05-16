import { env } from "@/shared/config/env";

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, data: object | string, msg?: string): void {
  const entry = {
    time: new Date().toISOString(),
    level,
    ...(typeof data === "string" ? { msg: data } : { ...data, msg: msg ?? "" }),
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else if (level === "debug" && env.NODE_ENV === "production") {
    // Silenciar debug en producción
    return;
  } else {
    console.log(line);
  }
}

export const logger = {
  info:  (data: object | string, msg?: string) => log("info",  data, msg),
  warn:  (data: object | string, msg?: string) => log("warn",  data, msg),
  error: (data: object | string, msg?: string) => log("error", data, msg),
  debug: (data: object | string, msg?: string) => log("debug", data, msg),
};
