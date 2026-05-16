import type { LeadSource, LeadStatus } from "../types";

export const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" }
];

export const sourceOptions: Array<{ value: LeadSource; label: string }> = [
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral" }
];

export const statusTone: Record<LeadStatus, string> = {
  new: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  contacted: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  lost: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
};
