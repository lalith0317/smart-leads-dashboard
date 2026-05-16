import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      next(new AppError("Validation failed", 400, result.error.flatten()));
      return;
    }

    req.body = result.data.body ?? req.body;
    req.params = result.data.params ?? req.params;
    req.query = result.data.query ?? req.query;
    next();
  };
};
