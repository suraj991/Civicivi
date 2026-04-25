"use client";

import { useEffect, useState } from "react";
import type { ImpactCategory } from "@/lib/types";
import { impactLevelColor, impactLevelBg, impactLevelLabel } from "@/lib/utils";

interface Props {
  label: string;
  emoji: string;
  data: ImpactCategory;
  delay?: number;
}

export default function ImpactScoreBar({ label, emoji, data, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(data.score), 100 + delay);
    return () => clearTimeout(timer);
  }, [data.score, delay]);

  const barColor = () => {
    switch (data.level) {
      case "positive": return "bg-gradient-to-r from-emerald-600 to-emerald-400";
      case "negative": return "bg-gradient-to-r from-rose-700 to-rose-400";
      case "mixed": return "bg-gradient-to-r from-amber-600 to-amber-400";
      default: return "bg-gradient-to-r from-slate-700 to-slate-500";
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${impactLevelBg(data.level)} transition-all hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-sm font-semibold text-slate-200">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-900/60 ${impactLevelColor(data.level)}`}>
            {impactLevelLabel(data.level)}
          </span>
          {data.level !== "not_directly_affected" && data.level !== "unclear" && (
            <span className="text-xs font-bold text-slate-300 w-8 text-right">{data.score}</span>
          )}
        </div>
      </div>

      {data.level !== "not_directly_affected" && (
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor()}`}
            style={{ width: `${width}%` }}
          />
        </div>
      )}

      <p className="text-slate-400 text-xs leading-relaxed">{data.explanation}</p>
    </div>
  );
}
