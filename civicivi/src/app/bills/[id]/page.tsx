"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImpactScoreBar from "@/components/impact/ImpactScoreBar";
import ImpactRadarChart from "@/components/impact/ImpactRadarChart";
import AudioPlayer from "@/components/audio/AudioPlayer";
import DiscussionSection from "@/components/discussion/DiscussionSection";
import { MOCK_BILLS, MOCK_IMPACT_ANALYSIS } from "@/lib/mockData";
import { loadProfile } from "@/lib/storage";
import { statusLabel, statusColor, topicColor, formatDate, partyColor } from "@/lib/utils";
import type { Bill, ImpactAnalysis, CivicProfile } from "@/lib/types";
import {
  ArrowLeft,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  MessageSquare,
  BarChart3,
  Globe,
  Building2,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

const IMPACT_CATEGORIES = [
  { key: "wallet" as const, label: "Wallet & Finances", emoji: "💰" },
  { key: "healthcare" as const, label: "Healthcare", emoji: "🏥" },
  { key: "education" as const, label: "Education", emoji: "🎓" },
  { key: "jobs" as const, label: "Jobs & Career", emoji: "💼" },
  { key: "housing" as const, label: "Housing", emoji: "🏠" },
  { key: "rights" as const, label: "Rights & Freedoms", emoji: "⚖️" },
  { key: "environment" as const, label: "Environment", emoji: "🌿" },
  { key: "local" as const, label: "Local Community", emoji: "📍" },
] as const;

type TabType = "impact" | "details" | "audio" | "discussion";

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [bill, setBill] = useState<Bill | null>(null);
  const [profile, setProfile] = useState<CivicProfile | null>(null);
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabType>("impact");
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const found = MOCK_BILLS.find((b) => b.id === id);
    if (!found) { router.replace("/bills"); return; }
    setBill(found);

    const p = loadProfile();
    setProfile(p);

    if (p) {
      analyzeImpact(found, p);
    }
  }, [id]);

  const analyzeImpact = async (b: Bill, p: CivicProfile) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/impact/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bill: {
            id: b.id,
            title: b.title,
            summary: b.summary,
            fullText: b.summary,
            topics: b.topics,
          },
          profile: p,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setAnalysis(data);
    } catch {
      setAnalysis(MOCK_IMPACT_ANALYSIS);
    } finally {
      setLoading(false);
    }
  };

  if (!bill) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
      </>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "impact", label: "My Impact", icon: BarChart3 },
    { id: "details", label: "Bill Details", icon: Globe },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "discussion", label: "Discussion", icon: MessageSquare },
  ];

  const overallScore = analysis
    ? Math.round(
        Object.values(analysis.impactScores).reduce((acc, cat) => acc + cat.score, 0) /
          Object.values(analysis.impactScores).length
      )
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 pb-16">
        {/* Bill header */}
        <div className="bg-slate-900/50 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <Link
              href="/bills"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Bills
            </Link>

            <div className="flex flex-wrap items-start gap-3 mb-3">
              <span className="text-sm font-mono text-slate-500">{bill.billNumber}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor(bill.status)}`}>
                {statusLabel(bill.status)}
              </span>
              {bill.trending && (
                <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                  <TrendingUp className="w-3 h-3" /> Trending
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {bill.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {bill.chamber === "house" ? "House" : bill.chamber === "senate" ? "Senate" : "Both Chambers"}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className={partyColor(bill.sponsorParty)}>{bill.sponsor}</span>
              </span>
              <span>Introduced {formatDate(bill.introducedDate)}</span>
              <span>Last action: {formatDate(bill.lastActionDate)}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {bill.topics.map((topic) => (
                <span
                  key={topic}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${topicColor(topic)}`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main content */}
            <div>
              {/* Tab navigation */}
              <div className="flex gap-1 mb-6 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {tabs.map(({ id: tabId, label, icon: Icon }) => (
                  <button
                    key={tabId}
                    onClick={() => setTab(tabId)}
                    className={`flex items-center gap-2 flex-1 justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      tab === tabId
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4 hidden sm:block" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Impact Tab */}
              {tab === "impact" && (
                <div className="space-y-6">
                  {!profile ? (
                    /* No profile CTA */
                    <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/25 rounded-2xl p-8 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                        <User className="w-7 h-7 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Personalized Impact Available</h3>
                      <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm">
                        Build your civic profile to see exactly how <strong className="text-slate-200">{bill.shortTitle}</strong>{" "}
                        affects your specific situation — wallet, healthcare, job, and more.
                      </p>
                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25"
                      >
                        Build My Civic Profile
                      </Link>
                    </div>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
                      </div>
                      <p className="text-slate-400 text-sm">Analyzing impact for your profile...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <p className="text-rose-300 text-sm">{error}</p>
                    </div>
                  ) : analysis ? (
                    <>
                      {/* Personal Summary Card */}
                      <div className="relative bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/25 rounded-2xl p-6 overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                              <User className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">
                              Your Personalized Summary
                            </span>
                          </div>
                          <p className="text-slate-200 leading-relaxed text-base">
                            {analysis.personalSummary}
                          </p>
                        </div>
                      </div>

                      {/* Plain English box */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
                          Plain English (ELI15)
                        </p>
                        <p className="text-slate-300 text-sm leading-relaxed">{analysis.plainEnglish}</p>
                      </div>

                      {/* Impact Score Bars */}
                      <div>
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-400" />
                          Impact by Life Category
                        </h3>
                        <div className="space-y-3">
                          {IMPACT_CATEGORIES.map((cat, i) => (
                            <ImpactScoreBar
                              key={cat.key}
                              label={cat.label}
                              emoji={cat.emoji}
                              data={analysis.impactScores[cat.key]}
                              delay={i * 80}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Who Benefits / Who Pays */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-emerald-300">Arguments For</h4>
                          </div>
                          <ul className="space-y-2">
                            {analysis.argumentsFor.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <h4 className="text-sm font-semibold text-rose-300">Arguments Against</h4>
                          </div>
                          <ul className="space-y-2">
                            {analysis.argumentsAgainst.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Who Benefits / Who Pays */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-emerald-300">Who Benefits</h4>
                          </div>
                          <ul className="space-y-1.5">
                            {analysis.whoBenefits.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <h4 className="text-sm font-semibold text-rose-300">Who Pays / Loses</h4>
                          </div>
                          <ul className="space-y-1.5">
                            {analysis.whoPays.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Local Impact */}
                      {analysis.localImpact.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-semibold text-blue-300">Local Impact</h4>
                          </div>
                          <ul className="space-y-2">
                            {analysis.localImpact.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Assumptions (collapsible) */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setShowAssumptions(!showAssumptions)}
                          className="w-full flex items-center justify-between p-4 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            Assumptions Made ({analysis.assumptions.length})
                          </span>
                          {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showAssumptions && (
                          <div className="px-4 pb-4 border-t border-slate-800">
                            <ul className="space-y-2 mt-3">
                              {analysis.assumptions.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                  <span className="text-amber-400 font-bold flex-shrink-0">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Questions to Ask */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setShowQuestions(!showQuestions)}
                          className="w-full flex items-center justify-between p-4 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                        >
                          <span className="flex items-center gap-2 font-medium">
                            <HelpCircle className="w-4 h-4 text-violet-400" />
                            Questions to Clarify Your Situation
                          </span>
                          {showQuestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showQuestions && (
                          <div className="px-4 pb-4 border-t border-slate-800">
                            <ul className="space-y-2 mt-3">
                              {analysis.questions.map((q, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                  <span className="text-violet-400 font-bold flex-shrink-0">{i + 1}.</span>
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Sources */}
                      {analysis.sources.length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Sources</p>
                          <ul className="space-y-1">
                            {analysis.sources.map((src, i) => (
                              <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                                <span className="text-slate-600 flex-shrink-0">[{i + 1}]</span>
                                {src}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              )}

              {/* Details Tab */}
              {tab === "details" && (
                <div className="space-y-5">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-base font-bold text-white mb-3">Bill Summary</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{bill.summary}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-base font-bold text-white mb-4">Legislative History</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-300 text-sm font-medium">{bill.lastAction}</p>
                          <p className="text-slate-500 text-xs">{formatDate(bill.lastActionDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-slate-400 text-sm">Introduced by {bill.sponsor}</p>
                          <p className="text-slate-500 text-xs">{formatDate(bill.introducedDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {bill.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-400 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2.5">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Details</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Chamber</span>
                        <span className="text-slate-300 capitalize">{bill.chamber}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Sponsor</span>
                        <span className={`${partyColor(bill.sponsorParty)} font-medium`}>{bill.sponsor}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Party</span>
                        <span className={`${partyColor(bill.sponsorParty)} font-medium`}>
                          {bill.sponsorParty === "D" ? "Democrat" : bill.sponsorParty === "R" ? "Republican" : "Independent"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Audio Tab */}
              {tab === "audio" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-5 h-5 text-violet-400" />
                      <h3 className="text-base font-bold text-white">AI Audio Summaries</h3>
                    </div>
                    <p className="text-slate-400 text-sm mb-6">
                      Powered by ElevenLabs. Listen while you commute.
                    </p>

                    <div className="space-y-3">
                      {profile && analysis && (
                        <AudioPlayer
                          billId={bill.id}
                          type="impact_brief"
                          label="🎯 Listen to My Impact Brief"
                          text={analysis.personalSummary}
                          accentColor="indigo"
                        />
                      )}
                      <AudioPlayer
                        billId={bill.id}
                        type="sixty_second"
                        label="⏱️ Listen to 60-Second Summary"
                        text={bill.summary}
                        accentColor="violet"
                      />
                      {analysis && (
                        <AudioPlayer
                          billId={bill.id}
                          type="debate"
                          label="⚖️ Listen to Debate Summary"
                          text={`Arguments for this bill: ${analysis.argumentsFor.join(". ")}. Arguments against: ${analysis.argumentsAgainst.join(". ")}`}
                          accentColor="amber"
                        />
                      )}
                    </div>

                    {!profile && (
                      <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <Link href="/profile" className="text-indigo-400 hover:underline">Create a profile</Link>
                        &nbsp;to unlock your personalized impact audio brief.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Discussion Tab */}
              {tab === "discussion" && (
                <div>
                  <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    Community Discussion
                  </h3>
                  <DiscussionSection billId={bill.id} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Confidence Score */}
              {analysis && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-300">Analysis Confidence</p>
                    <button
                      onClick={() => profile && analyzeImpact(bill, profile)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                      title="Re-analyze"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="#1e293b" strokeWidth="4" />
                        <circle
                          cx="20" cy="20" r="16"
                          fill="none"
                          stroke={analysis.confidence.score >= 70 ? "#10b981" : analysis.confidence.score >= 40 ? "#f59e0b" : "#f43f5e"}
                          strokeWidth="4"
                          strokeDasharray={`${(analysis.confidence.score / 100) * 100.5} 100.5`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                        {analysis.confidence.score}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{analysis.confidence.reason}</p>
                  </div>
                </div>
              )}

              {/* Radar Chart */}
              {analysis && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-slate-300 mb-1">Impact Overview</p>
                  <p className="text-xs text-slate-500 mb-3">All 8 life categories</p>
                  <ImpactRadarChart analysis={analysis} />
                </div>
              )}

              {/* Profile status */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Profile Used</p>
                {profile ? (
                  <div className="space-y-2">
                    {[
                      { label: "State", value: profile.state },
                      { label: "Role", value: profile.role },
                      { label: "Income", value: profile.incomeRange },
                      { label: "Healthcare", value: profile.healthcareStatus },
                    ].map(({ label, value }) =>
                      value ? (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-slate-500">{label}</span>
                          <span className="text-slate-300 capitalize font-medium">{value.replace(/-/g, " ")}</span>
                        </div>
                      ) : null
                    )}
                    <Link
                      href="/profile"
                      className="block mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Update profile →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-slate-500 text-xs mb-3">No profile yet. Create one to see personalized impact.</p>
                    <Link
                      href="/profile"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                    >
                      Create Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Bill Progress</p>
                {[
                  { label: "Introduced", done: true },
                  { label: "In Committee", done: ["committee","passed_house","passed_senate","signed"].includes(bill.status) },
                  { label: "Passed House", done: ["passed_house","passed_senate","signed"].includes(bill.status) },
                  { label: "Passed Senate", done: ["passed_senate","signed"].includes(bill.status) },
                  { label: "Signed into Law", done: bill.status === "signed" },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2.5 mb-2 last:mb-0">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${done ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"}`}>
                      {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-xs ${done ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
