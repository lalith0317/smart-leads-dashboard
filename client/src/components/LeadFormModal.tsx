import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { sourceOptions, statusOptions } from "../lib/options";
import type { Lead, LeadSource, LeadStatus } from "../types";

export interface LeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

interface LeadFormModalProps {
  lead?: Lead | null;
  saving: boolean;
  onClose(): void;
  onSubmit(payload: LeadPayload): Promise<void>;
}

const emptyForm: LeadPayload = {
  name: "",
  email: "",
  status: "new",
  source: "website"
};

export const LeadFormModal = ({ lead, saving, onClose, onSubmit }: LeadFormModalProps) => {
  const [form, setForm] = useState<LeadPayload>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      lead
        ? {
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source
          }
        : emptyForm
    );
    setError("");
  }, [lead]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    try {
      await onSubmit(form);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to save lead");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
      <section className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink dark:text-zinc-100">{lead ? "Edit lead" : "Create lead"}</h2>
          <button className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={onClose} type="button" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Status" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as LeadStatus }))}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select label="Source" value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value as LeadSource }))}>
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-200">{error}</div> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save lead"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
