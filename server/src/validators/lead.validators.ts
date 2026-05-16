import { z } from "zod";
import { leadSources, leadStatuses } from "../utils/constants.js";

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().toLowerCase(),
    status: z.enum(leadStatuses).default("new"),
    source: z.enum(leadSources)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid lead id")
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().email().toLowerCase().optional(),
      status: z.enum(leadStatuses).optional(),
      source: z.enum(leadSources).optional()
    })
    .refine((value) => Object.keys(value).length > 0, "At least one field is required")
});

export const leadIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid lead id")
  })
});

export const listLeadsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(10).default(10),
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    search: z.string().trim().max(100).optional(),
    sort: z.enum(["latest", "oldest"]).default("latest")
  })
});
