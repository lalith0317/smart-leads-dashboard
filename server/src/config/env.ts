import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGO_URI: z.string().min(1).default("mongodb://localhost:27017/smart-leads"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:5173")
});

export const env = envSchema.parse(process.env);
