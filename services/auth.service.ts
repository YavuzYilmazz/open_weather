import { prisma } from "../loaders/db.loader";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { ApiError } from "../utils/ApiError";

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

// Create and persist a new refresh token
export async function createRefreshToken(userId: string): Promise<string> {
  const token = jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // @ts-ignore: RefreshToken model may require prisma client regeneration
  await (prisma as any).refreshToken.create({
    data: { token, userId, expiresAt },
  });
  return token;
}

// Validate and rotate refresh token
export async function refreshTokenService(
  oldToken: string
): Promise<{ token: string; refreshToken: string }> {
  let payload: any;
  try {
    payload = jwt.verify(oldToken, jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }
  // @ts-ignore: RefreshToken model may require prisma client regeneration
  const stored = await (prisma as any).refreshToken.findUnique({
    where: { token: oldToken },
  });
  if (!stored || stored.expiresAt < new Date()) {
    // @ts-ignore: RefreshToken model may require prisma client regeneration
    await (prisma as any).refreshToken.deleteMany({
      where: { token: oldToken },
    });
    throw new ApiError(401, "Refresh token expired or revoked");
  }
  // Rotate: delete old token
  // @ts-ignore: RefreshToken model may require prisma client regeneration
  await (prisma as any).refreshToken.delete({ where: { token: oldToken } });
  const accessToken = jwt.sign({ sub: payload.sub }, jwtSecret, {
    expiresIn: "1d",
  });
  const refreshToken = await createRefreshToken(payload.sub);
  return { token: accessToken, refreshToken };
}

// Logout by deleting the refresh token
export async function logoutService(refreshToken: string): Promise<void> {
  // @ts-ignore: RefreshToken model may require prisma client regeneration
  await (prisma as any).refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}
