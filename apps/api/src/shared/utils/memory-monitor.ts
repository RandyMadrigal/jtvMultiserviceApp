export const startMemoryMonitor = () => {
  setInterval(() => {
    const used = process.memoryUsage();

    console.log("📊 Memory Usage");

    console.log({
      rss: `${(used.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    });

    console.log("--------------------------------");
  }, 10000);
};
