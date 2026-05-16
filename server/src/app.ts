import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { leadsRouter } from "./routes/leads.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Smart Leads API is healthy" });
});

app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);
app.use(notFound);
app.use(errorHandler);
