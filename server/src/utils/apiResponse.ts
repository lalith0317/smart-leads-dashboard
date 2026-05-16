import type { Response } from "express";

export const ok = <T>(res: Response, data: T, message?: string, status = 200): Response => {
  return res.status(status).json({ success: true, message, data });
};

export const created = <T>(res: Response, data: T, message = "Created"): Response => {
  return ok(res, data, message, 201);
};
