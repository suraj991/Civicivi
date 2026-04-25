"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 flex-1 justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            active === tab.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
