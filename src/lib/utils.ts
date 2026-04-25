import { type ImpactLevel } from "./types";

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function impactLevelColor(level: ImpactLevel): string {
  switch (level) {
    case "positive":
      return "text-emerald-400";
    case "negative":
      return "text-rose-400";
    case "mixed":
      return "text-amber-400";
    case "unclear":
      return "text-slate-400";
    case "not_directly_affected":
      return "text-slate-500";
  }
}

export function impactLevelBg(level: ImpactLevel): string {
  switch (level) {
    case "positive":
      return "bg-emerald-500/10 border-emerald-500/30";
    case "negative":
      return "bg-rose-500/10 border-rose-500/30";
    case "mixed":
      return "bg-amber-500/10 border-amber-500/30";
    case "unclear":
      return "bg-slate-500/10 border-slate-500/30";
    case "not_directly_affected":
      return "bg-slate-800/50 border-slate-700/30";
  }
}

export function impactLevelLabel(level: ImpactLevel): string {
  switch (level) {
    case "positive":
      return "Positive Impact";
    case "negative":
      return "Negative Impact";
    case "mixed":
      return "Mixed Impact";
    case "unclear":
      return "Unclear";
    case "not_directly_affected":
      return "Not Directly Affected";
  }
}

export function impactScoreColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  if (score >= 30) return "#f97316";
  return "#f43f5e";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    introduced: "Introduced",
    committee: "In Committee",
    passed_house: "Passed House",
    passed_senate: "Passed Senate",
    signed: "Signed into Law",
    vetoed: "Vetoed",
  };
  return map[status] || status;
}

export function statusColor(status: string): string {
  switch (status) {
    case "signed":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "passed_house":
    case "passed_senate":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "committee":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "introduced":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    case "vetoed":
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

export function topicColor(topic: string): string {
  const map: Record<string, string> = {
    education: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    healthcare: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    economy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    housing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    environment: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    taxes: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    jobs: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    technology: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "small business": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    rural: "bg-lime-500/20 text-lime-300 border-lime-500/30",
    childcare: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    families: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    finance: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    energy: "bg-green-500/20 text-green-300 border-green-500/30",
    climate: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  };
  return map[topic.toLowerCase()] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function partyColor(party: string): string {
  if (party === "D") return "text-blue-400";
  if (party === "R") return "text-rose-400";
  return "text-slate-400";
}
