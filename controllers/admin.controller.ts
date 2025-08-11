import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import {
  createUserService,
  listWeatherQueriesService,
  listUsersService,
  updateUserService,
  deleteUserService,
} from "../services/admin.service";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../loaders/db.loader";

// POST /admin/users - Create a new user (admin only)
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // allow first user (admin) creation without auth
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      const reqRole = (req as any).user?.role;
      if (reqRole !== "ADMIN") {
        return next(new ApiError(401, "Admin access required to create users"));
      }
    }
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUserService({ email, passwordHash, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// GET /admin/queries - List weather queries (admin only)
export async function listQueries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;
    const queries = await listWeatherQueriesService(page, size);
    res.json(queries);
  } catch (err) {
    next(err);
  }
}

// GET /admin/users - List all users (admin only)
export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await listUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/users/:id - Update user role (admin only)
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError(400, "User id is required"));
    }
    const { role } = req.body;
    if (!role) {
      return next(new ApiError(400, "Role is required"));
    }
    const updated = await updateUserService(id, role as Role);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /admin/users/:id - Delete a user (admin only)
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError(400, "User id is required"));
    }
    await deleteUserService(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
