import { logger } from "@/shared/utils/logger";

const INTERVAL_MS = 10_000;
const toMb = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export const startMemoryMonitor = (): NodeJS.Timeout => {
  const timer = setInterval(() => {
    const used = process.memoryUsage();
    logger.info(
      {
        rss: toMb(used.rss),
        heapTotal: toMb(used.heapTotal),
        heapUsed: toMb(used.heapUsed),
      },
      "Uso de memoria",
    );
  }, INTERVAL_MS);

  // No retener el proceso vivo solo por este monitor (p. ej. durante el shutdown)
  timer.unref();
  return timer;
};
