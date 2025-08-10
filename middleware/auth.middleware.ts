import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization header missing or malformed"));
  }

  const token = authHeader.split(" ")[1];

  if (!jwtSecret) {
    return next(
      new ApiError(500, "Server misconfiguration: missing JWT secret")
    );
  }

  try {
    const payload = (jwt.verify as any)(token, jwtSecret);

    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof (payload as any).sub === "string" &&
      typeof (payload as any).role === "string" &&
      typeof (payload as any).email === "string"
    ) {
      const p = payload as JwtPayload & { role: string; email: string };
      req.user = { id: p.sub as string, role: p.role, email: p.email };
      return next();
    }

    return next(new ApiError(401, "Invalid token payload"));
  } catch (_err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }
    next();
  };
}
