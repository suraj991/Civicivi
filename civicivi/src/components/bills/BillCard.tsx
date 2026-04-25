import Link from "next/link";
import { statusLabel, statusColor, topicColor, formatDate, partyColor } from "@/lib/utils";
import { TrendingUp, ArrowRight, Building2, Users } from "lucide-react";
import type { Bill } from "@/lib/types";

interface Props {
  bill: Bill;
  compact?: boolean;
}

export default function BillCard({ bill, compact }: Props) {
  if (compact) {
    return (
      <Link
        href={`/bills/${bill.id}`}
        className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-mono text-slate-500">{bill.billNumber}</span>
          {bill.trending && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {bill.trendScore}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2 text-sm leading-snug">
          {bill.shortTitle}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-4">{bill.summary.slice(0, 120)}...</p>
        <div className="flex flex-wrap gap-1.5">
          {bill.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700"
            >
              {topic}
            </span>
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/bills/${bill.id}`}
      className="group block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono text-slate-500">{bill.billNumber}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(bill.status)}`}>
              {statusLabel(bill.status)}
            </span>
            {bill.trending && (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-1">
            {bill.shortTitle}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">{bill.summary}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {bill.topics.map((topic) => (
              <span
                key={topic}
                className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${topicColor(topic)}`}
              >
                {topic}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              <span className={partyColor(bill.sponsorParty)}>{bill.sponsor}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {bill.chamber === "house" ? "House" : bill.chamber === "senate" ? "Senate" : "Both"}
            </span>
            <span>Updated {formatDate(bill.lastActionDate)}</span>
          </div>
        </div>

        <div className="sm:self-center flex-shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
            View Impact <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
