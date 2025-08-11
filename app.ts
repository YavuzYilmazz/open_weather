import express from "express";
import type { Express, Request, Response } from "express";

import weatherRoutes from "./routes/weather.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";

import { errorHandler } from "./middleware/error.middleware";
import { asyncHandler } from "./middleware/asyncHandler.middleware";

const app: Express = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

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
