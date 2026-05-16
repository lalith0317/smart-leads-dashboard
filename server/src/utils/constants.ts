export const leadStatuses = ["new", "contacted", "qualified", "lost"] as const;
export const leadSources = ["website", "instagram", "referral"] as const;
export const userRoles = ["admin", "sales"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type UserRole = (typeof userRoles)[number];

export const LEADS_PER_PAGE = 10;
