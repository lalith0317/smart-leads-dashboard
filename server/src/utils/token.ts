import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";
import type { UserRole } from "./constants.js";

export interface JwtUser {
  id: string;
  role: UserRole;
}

export const signToken = (payload: JwtUser): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as StringValue });
};

export const verifyToken = (token: string): JwtUser => {
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
};
