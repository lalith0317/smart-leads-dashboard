import { Schema, model, Types } from "mongoose";
import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from "../utils/constants.js";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: leadStatuses, default: "new", index: true },
    source: { type: String, enum: leadSources, required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ email: 1, owner: 1 }, { unique: true });

export const Lead = model<ILead>("Lead", leadSchema);
