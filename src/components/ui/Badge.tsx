import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}

const variants: Record<string, string> = {
  default: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  danger: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  muted: "bg-slate-800/50 text-slate-500 border-slate-700/30",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
