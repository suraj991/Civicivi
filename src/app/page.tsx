import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import USAMapSection from "@/components/map/USAMapSection";
import { ArrowRight, Zap, Shield, Volume2, BarChart3, Users, ChevronRight } from "lucide-react";
import { MOCK_BILLS } from "@/lib/mockData";

const features = [
  {
    icon: Zap,
    title: "Personalized Impact Engine",
    description:
      "Tell us who you are — your job, income, family situation. We analyze every bill through your lens and explain exactly what changes for you.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Shield,
    title: "Neutral. Factual. Transparent.",
    description:
      "No spin. No agenda. We show both sides, flag our assumptions, and tell you when we're uncertain. You decide what to think.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Volume2,
    title: "AI Audio Summaries",
    description:
      "Can't read? Commuting? Get your personalized impact brief or a 60-second summary in a natural human voice, powered by ElevenLabs.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: BarChart3,
    title: "Impact Score Dashboard",
    description:
      "Visual scores across 8 life categories: wallet, healthcare, jobs, housing, education, rights, local, environment. At a glance.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Users,
    title: "Structured Community Discussion",
    description:
      "Share opinions, ask questions, and cite sources. AI moderates for quality and summarizes the conversation.",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Build Your Civic Profile",
    desc: "Tell us your state, role, income range, employment sector, healthcare situation, and what you care about most.",
  },
  {
    step: "02",
    title: "Explore Legislation",
    desc: "Browse trending bills, search by topic, and filter by what matters to you — education, healthcare, housing, taxes.",
  },
  {
    step: "03",
    title: "Get Your Impact Report",
    desc: "Our AI analyzes each bill against your specific profile and delivers a personalized breakdown in plain English.",
  },
  {
    step: "04",
    title: "Hear It. Understand It.",
    desc: "Listen to your impact brief, explore community discussions, and engage in informed civic conversation.",
  },
];

export default function HomePage() {
  const trendingBills = MOCK_BILLS.filter((b) => b.trending).slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.1)_0%,_transparent_60%)]" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              Civic Tech · Personalized Policy Impact
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Government data tells</span>
              <br />
              <span className="text-white">us what happened.</span>
              <br className="hidden sm:block" />
              <span className="gradient-text">CiviCivi tells you</span>
              <br />
              <span className="gradient-text">what it means for</span>{" "}
              <span className="text-white italic">you.</span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Stop reading dry bill summaries. CiviCivi analyzes legislation against your specific life situation
              and explains exactly how it impacts your wallet, health, job, and community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/profile"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                Build My Civic Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/bills"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base transition-all border border-slate-700 hover:border-slate-600"
              >
                Explore Bills
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-base">100%</span> Politically neutral
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold text-base">8</span> Impact categories
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-bold text-base">AI</span> Audio summaries
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs">
            <span>Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
          </div>
        </section>

        {/* Interactive USA Map */}
        <USAMapSection />

        {/* Trending Bills Preview */}
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Right Now</p>
              <h2 className="text-3xl font-bold text-white">Trending Bills</h2>
            </div>
            <Link
              href="/bills"
              className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              See all bills <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingBills.map((bill) => (
              <Link
                key={bill.id}
                href={`/bills/${bill.id}`}
                className="group block p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500">{bill.billNumber}</span>
                  <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {bill.trendScore}
                  </span>
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
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="text-4xl font-bold text-white">How CiviCivi Works</h2>
              <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                Four steps from &ldquo;I don&apos;t understand this&rdquo; to &ldquo;I know exactly how this affects me.&rdquo;
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step) => (
                <div key={step.step} className="relative">
                  <div className="text-6xl font-black text-slate-800/60 mb-4 font-mono">{step.step}</div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 bg-slate-900/30 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
              <h2 className="text-4xl font-bold text-white">Built for informed citizens</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`p-6 rounded-2xl border ${feature.bg} transition-all hover:-translate-y-1`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center mb-4">
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 border-t border-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-6">
              Get Started Free
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Know what every bill
              <br />
              means <span className="gradient-text">for you.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Create your civic profile in 2 minutes. No account needed. No tracking. Just clarity.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all shadow-2xl shadow-indigo-500/30 hover:-translate-y-1"
            >
              Create My Civic Profile
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
