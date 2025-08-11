import { prisma } from "../loaders/db.loader";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}
// Refresh JWT token (stub implementation)
export async function refreshTokenService(oldToken: string): Promise<string> {
  if (isTokenBlacklisted(oldToken)) {
    throw new Error("Refresh token has been revoked");
  }
  // Verify existing token (ignoring expiration to allow refresh)
  let payload: any;
  try {
    payload = jwt.verify(oldToken, jwtSecret);
  } catch (err: any) {
    // If token expired, decode without verification
    if (err.name === "TokenExpiredError") {
      payload = jwt.decode(oldToken);
    } else {
      throw new Error("Invalid refresh token");
    }
  }
  const { sub: userId, role, email } = payload;
  // Issue new token
  return jwt.sign({ sub: userId, role, email }, jwtSecret, { expiresIn: "1d" });
}

// In-memory blacklist for tokens (for demonstration)
const tokenBlacklist = new Set<string>();

// Logout by blacklisting the token
export async function logoutService(token: string): Promise<void> {
  tokenBlacklist.add(token);
}

// Check if token is blacklisted
export function isTokenBlacklisted(token: string): boolean {
  return tokenBlacklist.has(token);
}
