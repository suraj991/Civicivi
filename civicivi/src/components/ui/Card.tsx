import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: string;
}

export default function Card({ children, className, hover, gradient }: CardProps) {
  return (
    <div
      className={cn(
        "bg-slate-900 border border-slate-800 rounded-2xl",
        hover && "hover:border-indigo-500/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30",
        gradient,
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pt-5 pb-3", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}
