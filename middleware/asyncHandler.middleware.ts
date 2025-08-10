import type { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler<T = any>(
  fn: (...args: any[]) => Promise<T>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
