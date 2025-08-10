import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { findUserByEmail } from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";

// POST /auth/login - User login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new ApiError(401, "Invalid email or password"));
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return next(new ApiError(401, "Invalid email or password"));
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      jwtSecret,
      { expiresIn: "1d" } //  jwt Token expiration time
    );
    res.json({ token });
  } catch (err) {
    next(err);
  }
}
