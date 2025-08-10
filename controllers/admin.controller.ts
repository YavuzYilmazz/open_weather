import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import {
  createUserService,
  listWeatherQueriesService,
} from "../services/admin.service";
import { Role } from "@prisma/client";

// POST /admin/users - Create a new user (admin only)
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, passwordHash, role } = req.body;
    if (!email || !passwordHash) {
      return next(new ApiError(400, "Email and passwordHash are required"));
    }
    const user = await createUserService({ email, passwordHash, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// GET /admin/queries - List all weather queries (admin only)
export async function listQueries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const queries = await listWeatherQueriesService();
    res.json(queries);
  } catch (err) {
    next(err);
  }
}
