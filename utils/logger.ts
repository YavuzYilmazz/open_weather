import winston from "winston";
const { combine, timestamp, printf, errors } = winston.format;

// Format for log entries
enum Level {
  INFO = "info",
  ERROR = "error",
}
const logFormat = printf((info: any) => {
  return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || Level.INFO,
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [new winston.transports.Console()],
});
