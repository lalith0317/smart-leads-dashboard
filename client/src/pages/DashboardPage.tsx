import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, Moon, Plus, RotateCcw, Search, Sun } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { LeadDetailsModal } from "../components/LeadDetailsModal";
import { LeadFormModal, type LeadPayload } from "../components/LeadFormModal";
import { LeadTable } from "../components/LeadTable";
import { Select } from "../components/Select";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { api, getErrorMessage } from "../lib/api";
import { sourceOptions, statusOptions } from "../lib/options";
import type { ApiResponse, Lead, LeadFilters, Pagination } from "../types";

const emptyPagination: Pagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false
};

const makeCsv = (leads: Lead[]) => {
  const headers = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((lead) => [lead.name, lead.email, lead.status, lead.source, new Date(lead.createdAt).toISOString()]);
  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>(emptyPagination);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, status: "", source: "", search: "", sort: "latest" });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null | undefined>(undefined);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("smart-leads-theme") === "dark");

  const query = useMemo(
    () => ({
      page: filters.page,
      status: filters.status || undefined,
      source: filters.source || undefined,
      search: filters.search || undefined,
      sort: filters.sort
    }),
    [filters]
  );

  useEffect(() => {
    setFilters((current) => ({ ...current, page: 1, search: debouncedSearch }));
  }, [debouncedSearch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("smart-leads-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<ApiResponse<{ items: Lead[]; pagination: Pagination }>>("/leads", { params: query });
      setLeads(response.data.data.items);
      setPagination(response.data.data.pagination);
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads();
  }, [query]);

  const saveLead = async (payload: LeadPayload) => {
    setSaving(true);
    try {
      if (editingLead) {
        await api.patch(`/leads/${editingLead._id}`, payload);
      } else {
        await api.post("/leads", payload);
      }
      setEditingLead(undefined);
      await fetchLeads();
    } catch (nextError) {
      throw new Error(getErrorMessage(nextError));
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async (lead: Lead) => {
    const confirmed = window.confirm(`Delete ${lead.name}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/leads/${lead._id}`);
      await fetchLeads();
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    }
  };

  const exportCsv = () => {
    const blob = new Blob([makeCsv(leads)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "smart-leads-export.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchInput("");
    setFilters({ page: 1, status: "", source: "", search: "", sort: "latest" });
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-ink dark:bg-[#121516] dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-pine dark:text-emerald-300">Smart Leads</p>
            <h1 className="mt-1 text-2xl font-bold">Lead Management Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">{user.role === "admin" ? "Admin" : "Sales User"}</span>
            <Button variant="secondary" onClick={() => setDarkMode((current) => !current)} aria-label="Toggle dark mode">
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut size={17} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total leads</p>
            <strong className="mt-2 block text-2xl">{pagination.total}</strong>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Page</p>
            <strong className="mt-2 block text-2xl">{pagination.page} / {pagination.totalPages}</strong>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active filters</p>
            <strong className="mt-2 block text-2xl">{[filters.status, filters.source, filters.search].filter(Boolean).length}</strong>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current role</p>
            <strong className="mt-2 block text-2xl">{user.role === "admin" ? "Admin" : "Sales"}</strong>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-9 text-zinc-400" size={17} />
              <Input label="Search" placeholder="Name or email" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="pl-9" />
            </div>
            <Select label="Status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, page: 1, status: event.target.value as LeadFilters["status"] }))}>
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
            <Select label="Source" value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, page: 1, source: event.target.value as LeadFilters["source"] }))}>
              <option value="">All sources</option>
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
            <Select label="Sort" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, page: 1, sort: event.target.value as LeadFilters["sort"] }))}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </Select>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={resetFilters} aria-label="Reset filters">
                <RotateCcw size={17} />
              </Button>
              <Button variant="secondary" onClick={exportCsv} disabled={leads.length === 0}>
                <Download size={17} />
                CSV
              </Button>
              <Button onClick={() => setEditingLead(null)}>
                <Plus size={17} />
                Lead
              </Button>
            </div>
          </div>
        </div>

        {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</div> : null}

        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-zinc-300 bg-white px-4 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <div>
              <h2 className="text-lg font-bold">No leads found</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Adjust the filters or create a new lead.</p>
            </div>
          </div>
        ) : (
          <LeadTable leads={leads} user={user} onView={setViewingLead} onEdit={setEditingLead} onDelete={deleteLead} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing {leads.length} of {pagination.total} leads
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={!pagination.hasPreviousPage || loading} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}>
              Previous
            </Button>
            <Button variant="secondary" disabled={!pagination.hasNextPage || loading} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>
              Next
            </Button>
          </div>
        </div>
      </section>

      {editingLead !== undefined ? <LeadFormModal lead={editingLead} saving={saving} onClose={() => setEditingLead(undefined)} onSubmit={saveLead} /> : null}
      {viewingLead ? <LeadDetailsModal lead={viewingLead} onClose={() => setViewingLead(null)} /> : null}
    </main>
  );
};
