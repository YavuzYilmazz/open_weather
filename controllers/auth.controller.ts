import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import {
  findUserByEmail,
  createRefreshToken,
  refreshTokenService,
  logoutService,
} from "../services/auth.service";
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
    // Issue access token and persistent refresh token
    const accessToken = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1d",
    });
    const refreshToken = await createRefreshToken(user.id);
    res.json({ token: accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}
// POST /auth/refresh - Refresh JWT
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return next(new ApiError(400, "Refresh token is required"));
    const { token: newAccessToken, refreshToken: newRefreshToken } =
      await refreshTokenService(refreshToken);
    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}
// POST /auth/logout - Logout user
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Logout by revoking refresh token
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new ApiError(400, "Refresh token is required for logout"));
    }
    await logoutService(refreshToken);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
