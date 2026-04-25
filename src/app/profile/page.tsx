"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { saveProfile, loadProfile } from "@/lib/storage";
import type { CivicProfile } from "@/lib/types";
import {
  MapPin,
  Briefcase,
  DollarSign,
  GraduationCap,
  Heart,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Check,
  Landmark,
} from "lucide-react";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const ROLES = [
  { value: "student", label: "Student", emoji: "🎓" },
  { value: "worker", label: "Full-time Worker", emoji: "💼" },
  { value: "part-time", label: "Part-time Worker", emoji: "⏰" },
  { value: "parent", label: "Parent / Caregiver", emoji: "👨‍👩‍👧" },
  { value: "self-employed", label: "Self-employed", emoji: "🏢" },
  { value: "retired", label: "Retired", emoji: "🌅" },
  { value: "unemployed", label: "Job Seeker", emoji: "🔍" },
  { value: "veteran", label: "Veteran", emoji: "🎖️" },
];

const INCOME_RANGES = [
  { value: "under-25k", label: "Under $25,000" },
  { value: "25k-50k", label: "$25,000 – $50,000" },
  { value: "50k-75k", label: "$50,000 – $75,000" },
  { value: "75k-100k", label: "$75,000 – $100,000" },
  { value: "100k-150k", label: "$100,000 – $150,000" },
  { value: "150k-plus", label: "Over $150,000" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const SECTORS = [
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "tech", label: "Technology" },
  { value: "government", label: "Government / Public Sector" },
  { value: "retail", label: "Retail / Service" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "finance", label: "Finance / Banking" },
  { value: "construction", label: "Construction / Trades" },
  { value: "agriculture", label: "Agriculture" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "arts", label: "Arts / Entertainment" },
  { value: "other", label: "Other" },
];

const EDUCATION_STATUSES = [
  { value: "high-school", label: "High school / GED" },
  { value: "some-college", label: "Some college" },
  { value: "associates", label: "Associate's degree" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "graduate", label: "Graduate degree" },
  { value: "currently-enrolled", label: "Currently enrolled" },
  { value: "trade-school", label: "Trade / vocational school" },
];

const HEALTHCARE_STATUSES = [
  { value: "employer", label: "Employer-sponsored insurance" },
  { value: "marketplace", label: "ACA Marketplace plan" },
  { value: "medicaid", label: "Medicaid / CHIP" },
  { value: "medicare", label: "Medicare" },
  { value: "uninsured", label: "Uninsured" },
  { value: "va", label: "VA / Military healthcare" },
  { value: "student-health", label: "Student health plan" },
  { value: "other", label: "Other" },
];

const CONCERNS = [
  { value: "taxes", label: "Taxes", color: "amber" },
  { value: "healthcare", label: "Healthcare", color: "rose" },
  { value: "housing", label: "Housing & Rent", color: "orange" },
  { value: "jobs", label: "Jobs & Economy", color: "blue" },
  { value: "education", label: "Education", color: "indigo" },
  { value: "environment", label: "Environment", color: "teal" },
  { value: "immigration", label: "Immigration", color: "violet" },
  { value: "student-loans", label: "Student Loans", color: "purple" },
  { value: "gun-policy", label: "Gun Policy", color: "slate" },
  { value: "civil-rights", label: "Civil Rights", color: "pink" },
  { value: "social-security", label: "Social Security", color: "emerald" },
  { value: "national-security", label: "National Security", color: "yellow" },
];

const STEPS = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "role", label: "Who You Are", icon: Briefcase },
  { id: "income", label: "Financial", icon: DollarSign },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "concerns", label: "Concerns", icon: CheckSquare },
];

const DEFAULT_PROFILE: CivicProfile = {
  state: "",
  zip: "",
  role: "",
  incomeRange: "",
  employmentSector: "",
  educationStatus: "",
  healthcareStatus: "",
  concerns: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CivicProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = loadProfile();
    if (existing) setProfile(existing);
  }, []);

  const update = (key: keyof CivicProfile, value: string | string[]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const toggleConcern = (val: string) => {
    setProfile((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(val)
        ? prev.concerns.filter((c) => c !== val)
        : [...prev.concerns, val],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return profile.state !== "";
      case 1: return profile.role !== "";
      case 2: return profile.incomeRange !== "";
      case 3: return profile.educationStatus !== "";
      case 4: return profile.healthcareStatus !== "";
      case 5: return profile.concerns.length > 0;
      default: return false;
    }
  };

  const handleFinish = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => router.push("/bills"), 1500);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-4">
              <Landmark className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Civic Profile</h1>
            <p className="text-slate-400">
              Help us personalize how bills affect you. Takes 2 minutes. No account needed.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isDone
                          ? "bg-indigo-600 text-white"
                          : isActive
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-500/25"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`hidden sm:block text-xs font-medium ${
                        isActive ? "text-indigo-300" : isDone ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-2 text-right">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>

          {/* Step cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 min-h-[400px] flex flex-col">
            {/* Step 0: Location */}
            {step === 0 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Where are you located?</h2>
                    <p className="text-slate-500 text-sm">We use this to show local bill impacts.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
                    <select
                      value={profile.state}
                      onChange={(e) => update("state", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                    >
                      <option value="">Select your state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ZIP Code <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={profile.zip}
                      onChange={(e) => update("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="e.g. 90210"
                      maxLength={5}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Role */}
            {step === 1 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">How do you identify?</h2>
                    <p className="text-slate-500 text-sm">This helps us tailor impact to your life situation.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => update("role", r.value)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        profile.role === r.value
                          ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-200"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      <span className="text-sm font-medium">{r.label}</span>
                      {profile.role === r.value && (
                        <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {(profile.role === "worker" || profile.role === "part-time" || profile.role === "self-employed") && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employment Sector</label>
                    <select
                      value={profile.employmentSector}
                      onChange={(e) => update("employmentSector", e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select sector (optional)</option>
                      {SECTORS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Income */}
            {step === 2 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">What is your income range?</h2>
                    <p className="text-slate-500 text-sm">Used to calculate financial impacts like tax credits and eligibility.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {INCOME_RANGES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => update("incomeRange", r.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        profile.incomeRange === r.value
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-sm font-medium">{r.label}</span>
                      {profile.incomeRange === r.value && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>

                <p className="text-slate-600 text-xs mt-3">
                  This information is stored locally on your device only.
                </p>
              </div>
            )}

            {/* Step 3: Education */}
            {step === 3 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Highest education level?</h2>
                    <p className="text-slate-500 text-sm">Helps analyze education bills and workforce training programs.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {EDUCATION_STATUSES.map((e) => (
                    <button
                      key={e.value}
                      onClick={() => update("educationStatus", e.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        profile.educationStatus === e.value
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-200"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-sm font-medium">{e.label}</span>
                      {profile.educationStatus === e.value && (
                        <Check className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Healthcare */}
            {step === 4 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">How are you covered?</h2>
                    <p className="text-slate-500 text-sm">Determines how healthcare bills affect you specifically.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {HEALTHCARE_STATUSES.map((h) => (
                    <button
                      key={h.value}
                      onClick={() => update("healthcareStatus", h.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        profile.healthcareStatus === h.value
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-200"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-sm font-medium">{h.label}</span>
                      {profile.healthcareStatus === h.value && (
                        <Check className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Concerns */}
            {step === 5 && (
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">What issues matter most?</h2>
                    <p className="text-slate-500 text-sm">Select all that apply. We&apos;ll prioritize these in your impact reports.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONCERNS.map((c) => {
                    const selected = profile.concerns.includes(c.value);
                    return (
                      <button
                        key={c.value}
                        onClick={() => toggleConcern(c.value)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all text-sm font-medium ${
                          selected
                            ? "bg-indigo-500/15 border-indigo-500/50 text-indigo-200"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <span>{c.label}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-1 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {profile.concerns.length > 0 && (
                  <p className="text-emerald-400 text-sm mt-4 font-medium">
                    {profile.concerns.length} concern{profile.concerns.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed() || saved}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/25"
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" /> Profile Saved!
                    </>
                  ) : (
                    <>
                      Save & Explore Bills <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Privacy note */}
          <p className="text-center text-slate-600 text-xs mt-4">
            Your profile is stored only in your browser. We never send or sell your data.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
