import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status =
    err instanceof ApiError
      ? err.statusCode
      : typeof err === "object" &&
          err !== null &&
          "statusCode" in err &&
          typeof (err as any).statusCode === "number"
        ? (err as any).statusCode
        : typeof err === "object" &&
            err !== null &&
            "status" in err &&
            typeof (err as any).status === "number"
          ? (err as any).status
          : 500;

  const message =
    err instanceof ApiError
      ? err.message
      : typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as any).message === "string"
        ? (err as any).message
        : "Internal Server Error";

  const body: Record<string, unknown> = { error: message };
  if (err instanceof ApiError && err.metadata) {
    body.metadata = err.metadata;
  }
  // Include stack trace in development environment
  if (
    process.env.NODE_ENV === "development" &&
    err &&
    typeof err === "object" &&
    "stack" in err
  ) {
    body.stack = (err as any).stack;
  }

  res.status(Number(status)).json(body);
}
