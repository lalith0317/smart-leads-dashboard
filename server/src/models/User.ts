import bcrypt from "bcryptjs";
import { Schema, model, type HydratedDocument, type Model } from "mongoose";
import { userRoles, type UserRole } from "../utils/constants.js";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, UserMethods>;
export type UserDocument = HydratedDocument<IUser, UserMethods>;

const userSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: userRoles, default: "sales" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser, UserModel>("User", userSchema);
