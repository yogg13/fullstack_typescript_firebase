// Simple custom logger for development
export const createSimpleLogger = () => {
  const colors = {
    info: "\x1b[36m", // Cyan
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    success: "\x1b[32m", // Green
    reset: "\x1b[0m", // Reset
  };

  const getTimestamp = () => {
    return new Date().toISOString().replace("T", " ").substr(0, 19);
  };

  return {
    info: (message: string, ...args: any[]) => {
      console.log(
        `${colors.info}[${getTimestamp()}] INFO:${colors.reset} ${message}`,
        ...args
      );
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(
        `${colors.warn}[${getTimestamp()}] WARN:${colors.reset} ${message}`,
        ...args
      );
    },
    error: (message: string, ...args: any[]) => {
      console.error(
        `${colors.error}[${getTimestamp()}] ERROR:${colors.reset} ${message}`,
        ...args
      );
    },
    success: (message: string, ...args: any[]) => {
      console.log(
        `${colors.success}[${getTimestamp()}] SUCCESS:${
          colors.reset
        } ${message}`,
        ...args
      );
    },
  };
};
