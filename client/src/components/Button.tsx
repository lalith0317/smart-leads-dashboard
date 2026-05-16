import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pine text-white hover:bg-[#0d4e3b] disabled:bg-zinc-300",
  secondary: "bg-white text-ink ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-800",
  danger: "bg-coral text-white hover:bg-[#b84b2e]",
  ghost: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={clsx(
      "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-pine focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
      variants[variant],
      className
    )}
    {...props}
  />
);
