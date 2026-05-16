export type UserRole = "admin" | "sales";
export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "instagram" | "referral";
export type SortOrder = "latest" | "oldest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  owner?: Pick<User, "name" | "email" | "role">;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

export interface LeadFilters {
  page: number;
  status?: LeadStatus | "";
  source?: LeadSource | "";
  search?: string;
  sort: SortOrder;
}
