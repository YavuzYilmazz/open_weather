import express from "express";
import type { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import * as Sentry from "@sentry/node";
import { collectDefaultMetrics, register } from "prom-client";
import { logger } from "./utils/logger";
import { sentryDsn } from "./config/config";

import weatherRoutes from "./routes/weather.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

import { errorHandler } from "./middleware/error.middleware";
import { asyncHandler } from "./middleware/asyncHandler.middleware";

const app: Express = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
// Log all requests with status code when response finishes
app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});
// Initialize Sentry if DSN provided
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV ?? "production",
    tracesSampleRate: 1.0,
  });
}
// Rate limiting middleware: max 100 requests per 15 minutes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (_req, res) =>
      res.status(429).json({ error: "Too many requests" }),
  })
);
// Prometheus metrics endpoint
collectDefaultMetrics();
app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ ok: true });
  })
);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/weather", weatherRoutes);
app.use("/me", userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;
