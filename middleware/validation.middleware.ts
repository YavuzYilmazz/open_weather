import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ApiError } from "../utils/ApiError";

export function validateBody(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      // Return first validation error message or default
      const msg = error.details?.[0]?.message ?? error.message;
      return next(new ApiError(400, msg));
    }
    next();
  };
}

export function validateParams(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      const msg = error.details?.[0]?.message ?? error.message;
      return next(new ApiError(400, msg));
    }
    next();
  };
}
