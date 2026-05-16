import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => (
  <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
    {label}
    <input
      className={clsx(
        "h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-ink outline-none transition placeholder:text-zinc-400 focus:border-pine focus:ring-2 focus:ring-pine/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    />
    {error ? <span className="text-xs font-medium text-coral">{error}</span> : null}
  </label>
);
