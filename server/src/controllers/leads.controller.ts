import type { FilterQuery } from "mongoose";
import { Lead, type ILead } from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/apiResponse.js";
import { AppError } from "../utils/AppError.js";
import { LEADS_PER_PAGE } from "../utils/constants.js";

export const listLeads = asyncHandler(async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = LEADS_PER_PAGE;
  const sort = req.query.sort === "oldest" ? 1 : -1;
  const filters: FilterQuery<ILead> = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.source) filters.source = req.query.source;
  if (req.query.search) {
    const search = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  }

  const total = await Lead.countDocuments(filters);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const items = await Lead.find(filters)
    .sort({ createdAt: sort })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "name email role")
    .lean();

  ok(res, {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user?.id });
  created(res, { lead }, "Lead created successfully");
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate("owner", "name email role");
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  ok(res, { lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  ok(res, { lead }, "Lead updated successfully");
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  ok(res, { id: req.params.id }, "Lead deleted successfully");
});
