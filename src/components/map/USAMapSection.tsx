"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { X, TrendingUp, ArrowRight, MapPin, ChevronRight } from "lucide-react";
import { statusColor, statusLabel, topicColor, formatDate } from "@/lib/utils";
import { FIPS_TO_STATE, STATE_PROFILES, getBillsForState } from "./stateData";
import type { Bill } from "@/lib/types";

// Dynamically import the map to avoid SSR issues with D3
const MapChart = dynamic(() => import("./MapChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] bg-slate-900/60 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-slate-600 text-sm">Loading map...</div>
    </div>
  ),
});

interface SelectedState {
  fips: string;
  name: string;
  abbr: string;
  bills: Bill[];
}

export default function USAMapSection() {
  const [selected, setSelected] = useState<SelectedState | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  const handleStateClick = useCallback((fips: string) => {
    const stateInfo = FIPS_TO_STATE[fips];
    if (!stateInfo) return;
    setSelected({
      fips,
      name: stateInfo.name,
      abbr: stateInfo.abbr,
      bills: getBillsForState(stateInfo.abbr),
    });
  }, []);

  const handleStateHover = useCallback(
    (fips: string | null, x?: number, y?: number) => {
      if (!fips) { setTooltip(null); return; }
      const stateInfo = FIPS_TO_STATE[fips];
      if (stateInfo && x !== undefined && y !== undefined) {
        setTooltip({ name: stateInfo.name, x, y });
      }
    },
    []
  );

  const profile = selected ? STATE_PROFILES[selected.abbr] : null;

  return (
    <section className="py-20 px-4 sm:px-6 border-t border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.04)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Interactive
          </p>
          <h2 className="text-4xl font-bold text-white mb-3">
            Browse Bills by State
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Click any state to see the bills most relevant to its residents — based on local economy, industries, and demographics.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Map container */}
          <div className="flex-1 relative">
            {/* Map wrapper with glow */}
            <div
              className="relative rounded-2xl overflow-hidden border border-slate-800/60"
              style={{
                background: "linear-gradient(135deg, #020c18 0%, #04111f 50%, #020c18 100%)",
                boxShadow: "0 0 60px rgba(6,182,212,0.08), inset 0 0 60px rgba(6,182,212,0.03)",
              }}
            >
              <MapChart
                selectedFips={selected?.fips ?? null}
                onStateClick={handleStateClick}
                onStateHover={handleStateHover}
              />

              {/* Hint text */}
              {!selected && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-slate-500 bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
                  <MapPin className="w-3 h-3 text-cyan-500" />
                  Click a state to see relevant bills
                </div>
              )}
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-20 pointer-events-none px-2.5 py-1.5 rounded-lg bg-slate-900/95 border border-cyan-500/30 text-xs font-semibold text-cyan-200 shadow-xl shadow-black/40 backdrop-blur-sm transition-all duration-75"
                style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
              >
                {tooltip.name}
              </div>
            )}
          </div>

          {/* State bills panel */}
          <div
            className={`lg:w-[360px] transition-all duration-300 ${
              selected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 lg:pointer-events-none"
            }`}
          >
            {selected && profile && (
              <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Panel header */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-slate-900 border-b border-slate-800 px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{profile.emoji}</span>
                        <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                      </div>
                      <p className="text-cyan-400 text-xs font-semibold">{profile.focus}</p>
                      <p className="text-slate-500 text-xs mt-1 line-clamp-2">{profile.highlight}</p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors ml-3 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bills list */}
                <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                    Top bills affecting {selected.name} residents
                  </p>

                  {selected.bills.map((bill) => (
                    <Link
                      key={bill.id}
                      href={`/bills/${bill.id}`}
                      className="group block bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/30 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono text-slate-500">{bill.billNumber}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {bill.trending && (
                            <span className="flex items-center gap-1 text-xs text-amber-400">
                              <TrendingUp className="w-3 h-3" />
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(bill.status)}`}>
                            {statusLabel(bill.status)}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors mb-2 line-clamp-2 leading-snug">
                        {bill.shortTitle}
                      </h4>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {bill.topics.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className={`px-1.5 py-0.5 rounded-full text-xs border capitalize ${topicColor(t)}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">{formatDate(bill.lastActionDate)}</span>
                        <span className="text-xs text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 transition-colors">
                          View Impact <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800 p-4">
                  <Link
                    href="/bills"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-sm font-semibold transition-all"
                  >
                    View All Bills <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Empty state hint */}
            {!selected && (
              <div className="hidden lg:flex flex-col items-center justify-center h-64 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                  <MapPin className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-slate-600 text-sm">Click a state on the map</p>
                <p className="text-slate-700 text-xs mt-1">to see relevant bills</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "States covered", value: "50" , color: "text-cyan-400" },
            { label: "Active bills tracked", value: "8+", color: "text-indigo-400" },
            { label: "Impact categories", value: "8", color: "text-emerald-400" },
            { label: "Data updated", value: "Live", color: "text-amber-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
