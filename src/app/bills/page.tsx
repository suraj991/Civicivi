"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { statusLabel, statusColor, topicColor, formatDate, partyColor } from "@/lib/utils";
import { Search, SlidersHorizontal, TrendingUp, X, ArrowRight, Building2, Users, Loader2, RefreshCw, Database } from "lucide-react";
import type { Bill } from "@/lib/types";

const ALL_STATUSES = ["introduced", "committee", "passed_house", "passed_senate", "signed", "vetoed"];

const TOPIC_FILTERS = [
  "education", "healthcare", "economy", "housing", "environment",
  "taxes", "jobs", "technology", "small business", "rural", "childcare",
  "energy", "national-security", "immigration", "civil-rights", "finance",
];

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"congress.gov" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"trending" | "recent">("recent");

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bills?limit=20");
      if (!res.ok) throw new Error("Failed to fetch bills");
      const data = await res.json() as { bills: Bill[]; source: string };
      setBills(data.bills);
      setDataSource(data.source as "congress.gov" | "mock");
    } catch (err) {
      setError("Could not load bills. Showing sample data.");
      // Last-resort: import mock data client-side
      const { MOCK_BILLS } = await import("@/lib/mockData");
      setBills(MOCK_BILLS);
      setDataSource("mock");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  // Client-side search when not using real API search
  const handleSearchSubmit = async (q: string) => {
    if (!q.trim()) { fetchBills(); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/bills?q=${encodeURIComponent(q)}`);
      const data = await res.json() as { bills: Bill[]; source: string };
      setBills(data.bills);
      setDataSource(data.source as "congress.gov" | "mock");
    } catch {
      // fall through to client-side filter
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (t: string) =>
    setSelectedTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleStatus = (s: string) =>
    setSelectedStatuses((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const filteredBills = useMemo(() => {
    let list = [...bills];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.shortTitle.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTopics.length > 0) {
      list = list.filter((b) =>
        selectedTopics.some((t) => b.topics.some((bt) => bt.includes(t)))
      );
    }

    if (selectedStatuses.length > 0) {
      list = list.filter((b) => selectedStatuses.includes(b.status));
    }

    return list.sort((a, b) =>
      sortBy === "trending"
        ? b.trendScore - a.trendScore
        : new Date(b.lastActionDate).getTime() - new Date(a.lastActionDate).getTime()
    );
  }, [bills, search, selectedTopics, selectedStatuses, sortBy]);

  const activeFilterCount = selectedTopics.length + selectedStatuses.length;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Legislation</p>
              <h1 className="text-4xl font-bold text-white mb-2">Explore Bills</h1>
              <p className="text-slate-400">
                Browse active legislation. Build a profile to see personalized impact for each bill.
              </p>
            </div>

            {/* Data source badge */}
            {dataSource && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    dataSource === "congress.gov"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  <Database className="w-3 h-3" />
                  {dataSource === "congress.gov" ? "Live · Congress.gov" : "Sample Data"}
                </div>
                <button
                  onClick={fetchBills}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                  title="Refresh bills"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm">
              {error}
            </div>
          )}

          {/* Search + filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && dataSource === "congress.gov") {
                    handleSearchSubmit(search);
                  }
                }}
                placeholder={
                  dataSource === "congress.gov"
                    ? "Search Congress.gov — press Enter to search…"
                    : "Search bills by title, topic, or keyword…"
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); fetchBills(); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex rounded-xl overflow-hidden border border-slate-800">
              <button
                onClick={() => setSortBy("recent")}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
                  sortBy === "recent" ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setSortBy("trending")}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
                  sortBy === "trending" ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Trending
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_FILTERS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                        selectedTopics.includes(topic)
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200"
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Status</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedStatuses.includes(status)
                          ? `${statusColor(status)}`
                          : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSelectedTopics([]); setSelectedStatuses([]); }}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">
                {dataSource === null ? "Fetching latest bills from Congress.gov…" : "Searching…"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-4">
                Showing{" "}
                <span className="text-slate-300 font-semibold">{filteredBills.length}</span>{" "}
                bill{filteredBills.length !== 1 ? "s" : ""}
                {activeFilterCount > 0 || search ? " (filtered)" : ""}
                {dataSource === "congress.gov" && (
                  <span className="ml-2 text-emerald-500/70">· live data</span>
                )}
              </p>

              {filteredBills.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-slate-300 font-semibold mb-1">No bills found</p>
                  <p className="text-slate-500 text-sm">
                    Try different search terms or clear your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredBills.map((bill) => (
                    <BillListCard key={bill.id} bill={bill} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function BillListCard({ bill }: { bill: Bill }) {
  return (
    <Link
      href={`/bills/${encodeURIComponent(bill.id)}`}
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
            {bill.topics.slice(0, 3).map((topic) => (
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
