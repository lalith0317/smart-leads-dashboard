import { Router } from "express";
import { createLead, deleteLead, getLead, listLeads, updateLead } from "../controllers/leads.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLeadSchema, leadIdSchema, listLeadsSchema, updateLeadSchema } from "../validators/lead.validators.js";

export const leadsRouter = Router();

leadsRouter.use(requireAuth);
leadsRouter.get("/", validate(listLeadsSchema), listLeads);
leadsRouter.post("/", validate(createLeadSchema), createLead);
leadsRouter.get("/:id", validate(leadIdSchema), getLead);
leadsRouter.patch("/:id", validate(updateLeadSchema), updateLead);
leadsRouter.delete("/:id", requireRoles("admin"), validate(leadIdSchema), deleteLead);
