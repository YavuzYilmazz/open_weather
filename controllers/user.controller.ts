import type { Request, Response, NextFunction } from "express";
import { listUserQueriesService } from "../services/user.service";
import { listWeatherQueriesService } from "../services/admin.service";
import { ApiError } from "../utils/ApiError";

// GET /weather/queries - List queries for the authenticated user
export async function listUserQueries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    if (!user?.id) {
      return next(new ApiError(401, "User not authenticated"));
    }
    // Admin sees all queries, others see only their own
    if (user.role === "ADMIN") {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 10;
      const queries = await listWeatherQueriesService(page, size);
      return res.json(queries);
    }
    const queries = await listUserQueriesService(user.id);
    res.json(queries);
  } catch (err) {
    next(err);
  }
}
