import { Link } from "react-router-dom";

export const AuthLayout = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <main className="grid min-h-screen place-items-center bg-[#f7f8f4] px-4 py-10 text-ink dark:bg-[#121516] dark:text-zinc-100">
    <section className="w-full max-w-md">
      <div className="mb-7">
        <Link to="/" className="text-sm font-bold uppercase tracking-[0.18em] text-pine dark:text-emerald-300">
          Smart Leads
        </Link>
        <h1 className="mt-5 text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">{children}</div>
    </section>
  </main>
);
