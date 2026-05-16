import { CalendarDays, Mail, UserRound, X } from "lucide-react";
import { statusOptions, statusTone } from "../lib/options";
import type { Lead } from "../types";

interface LeadDetailsModalProps {
  lead: Lead;
  onClose(): void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));

export const LeadDetailsModal = ({ lead, onClose }: LeadDetailsModalProps) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
    <section className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink dark:text-zinc-100">{lead.name}</h2>
          <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[lead.status]}`}>
            {statusOptions.find((option) => option.value === lead.status)?.label}
          </span>
        </div>
        <button className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={onClose} type="button" aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <dl className="grid gap-4 text-sm">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 text-pine dark:text-emerald-300" size={18} />
          <div>
            <dt className="font-semibold text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="text-ink dark:text-zinc-100">{lead.email}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 text-pine dark:text-emerald-300" size={18} />
          <div>
            <dt className="font-semibold text-zinc-500 dark:text-zinc-400">Source</dt>
            <dd className="capitalize text-ink dark:text-zinc-100">{lead.source}</dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 text-pine dark:text-emerald-300" size={18} />
          <div>
            <dt className="font-semibold text-zinc-500 dark:text-zinc-400">Created</dt>
            <dd className="text-ink dark:text-zinc-100">{formatDate(lead.createdAt)}</dd>
          </div>
        </div>
      </dl>
    </section>
  </div>
);
