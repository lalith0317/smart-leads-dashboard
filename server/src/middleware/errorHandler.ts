import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.flatten();
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource id";
  } else if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: details,
    stack: env.NODE_ENV === "development" ? error.stack : undefined
  });
};
