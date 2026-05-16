import { Eye, Pencil, Trash2 } from "lucide-react";
import { statusOptions, statusTone } from "../lib/options";
import type { Lead, User } from "../types";

interface LeadTableProps {
  leads: Lead[];
  user: User;
  onView(lead: Lead): void;
  onEdit(lead: Lead): void;
  onDelete(lead: Lead): void;
}

const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(date));

export const LeadTable = ({ leads, user, onView, onEdit, onDelete }: LeadTableProps) => (
  <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-bold">Lead</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Source</th>
            <th className="px-4 py-3 font-bold">Created</th>
            <th className="px-4 py-3 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60">
              <td className="px-4 py-4">
                <div className="font-semibold text-ink dark:text-zinc-100">{lead.name}</div>
                <div className="text-zinc-500 dark:text-zinc-400">{lead.email}</div>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[lead.status]}`}>
                  {statusOptions.find((option) => option.value === lead.status)?.label}
                </span>
              </td>
              <td className="px-4 py-4 capitalize text-zinc-700 dark:text-zinc-200">{lead.source}</td>
              <td className="px-4 py-4 text-zinc-600 dark:text-zinc-300">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <button className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => onView(lead)} type="button" aria-label="View lead">
                    <Eye size={17} />
                  </button>
                  <button className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => onEdit(lead)} type="button" aria-label="Edit lead">
                    <Pencil size={17} />
                  </button>
                  {user.role === "admin" ? (
                    <button className="rounded-md p-2 text-coral hover:bg-red-50 dark:hover:bg-red-950" onClick={() => onDelete(lead)} type="button" aria-label="Delete lead">
                      <Trash2 size={17} />
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
