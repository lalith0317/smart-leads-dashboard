import { clsx } from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = ({ label, className, children, ...props }: SelectProps) => (
  <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
    {label}
    <select
      className={clsx(
        "h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  </label>
);
