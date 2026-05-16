import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import type { UserRole } from "../utils/constants.js";
import { verifyToken } from "../utils/token.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Authentication token is required", 401));
    return;
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
};
