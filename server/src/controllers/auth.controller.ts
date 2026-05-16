import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { signToken } from "../utils/token.js";

const serializeUser = (user: { _id: unknown; name: string; email: string; role: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = asyncHandler(async (req, res) => {
  const existing = await User.exists({ email: req.body.email });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create(req.body);
  const token = signToken({ id: user.id, role: user.role });
  created(res, { user: serializeUser(user), token }, "Registration successful");
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ id: user.id, role: user.role });
  ok(res, { user: serializeUser(user), token }, "Login successful");
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  ok(res, { user: serializeUser(user) });
});
