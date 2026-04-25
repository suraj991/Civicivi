# CiviCivi — Project Documentation

## What Is This?

CiviCivi is a civic tech web app that explains how US government bills and legislation personally affect each user based on their specific life situation. Instead of showing dry bill summaries, it analyzes a bill against the user's profile (state, income, job sector, healthcare status, concerns) and tells them exactly how it impacts their wallet, health, job, housing, and community.

**Live at:** `http://localhost:3000` (dev) · `npm run dev` to start

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI Analysis | Google Gemini API (`gemini-2.0-flash`) |
| AI Audio | ElevenLabs API |
| Bill Data | Congress.gov API (free, official) |
| Map | `react-simple-maps` with `geoAlbersUsa` projection |
| Charts | `recharts` RadarChart |
| Profile Storage | `localStorage` (no account needed) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero section + interactive US map |
| `/profile` | 5-step wizard to build a civic profile (state, income, role, concerns, etc.) |
| `/bills` | Bill explorer with search, topic filters, trending toggle |
| `/bills/[id]` | Bill detail — impact analysis, radar chart, audio summary, discussion |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/bills` | GET | List/search bills. Uses Congress.gov if `CONGRESS_API_KEY` set, else mock data |
| `/api/bills/[billId]` | GET | Fetch single bill by ID |
| `/api/impact/analyze` | POST | Run Gemini AI analysis of bill vs. user profile. Falls back to mock if quota exceeded |
| `/api/audio/generate` | POST | Generate ElevenLabs audio summary |
| `/api/discussion` | GET/POST | Discussion posts for a bill |

---

## Key Files

```
src/
├── app/
│   ├── page.tsx                    — Homepage
│   ├── profile/page.tsx            — Profile wizard
│   ├── bills/page.tsx              — Bill explorer
│   ├── bills/[id]/page.tsx         — Bill detail + impact UI
│   └── api/
│       ├── bills/route.ts          — Bills list/search endpoint
│       ├── bills/[billId]/route.ts — Single bill endpoint
│       ├── impact/analyze/route.ts — Gemini impact analysis
│       ├── audio/generate/route.ts — ElevenLabs audio
│       └── discussion/route.ts     — Discussion posts
├── components/
│   ├── map/
│   │   ├── USAMapSection.tsx       — Full map section with tooltip + state panel
│   │   ├── MapChart.tsx            — react-simple-maps chart (client-only, ssr:false)
│   │   └── stateData.ts            — State profiles, FIPS codes, bill-to-state matching
│   ├── impact/
│   │   ├── ImpactRadarChart.tsx    — Recharts radar chart for 8 impact categories
│   │   └── ImpactScoreBar.tsx      — Individual category score bar
│   ├── audio/AudioPlayer.tsx       — ElevenLabs audio player UI
│   ├── bills/BillCard.tsx          — Bill card used in explorer + map panel
│   ├── discussion/DiscussionSection.tsx
│   └── layout/Header.tsx + Footer.tsx
├── lib/
│   ├── types.ts                    — All TypeScript interfaces (Bill, CivicProfile, ImpactAnalysis, etc.)
│   ├── congressApi.ts              — Congress.gov API client + data transforms
│   ├── mockData.ts                 — 8 realistic mock bills + mock impact analysis
│   ├── storage.ts                  — localStorage helpers for civic profile
│   └── utils.ts                    — Shared utilities
└── types/
    └── react-simple-maps.d.ts      — TypeScript declarations for react-simple-maps
```

---

## Environment Variables

Create `.env.local` in the project root:

```bash
# Required for AI impact analysis
GEMINI_API_KEY=your_key_here          # https://aistudio.google.com/app/apikey

# Required for audio summaries
ELEVENLABS_API_KEY=your_key_here      # https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM   # Optional, defaults to Rachel

# Required for real bill data
CONGRESS_API_KEY=your_key_here        # https://api.congress.gov/sign-up/
```

**All three are optional** — the app fully works without any API keys using mock data and mock analysis.

---

## Fallback Architecture

Every external API call has a silent fallback so the app always works:

```
Congress.gov API  →  fails?  →  8 mock bills (MOCK_BILLS in mockData.ts)
Gemini API        →  fails?  →  generateMockAnalysis() — profile-aware mock
ElevenLabs API    →  fails?  →  audio button disabled gracefully
```

---

## Bill ID Format

Real Congress.gov bills use: `"{congress}-{type}-{number}"` — e.g. `"119-hr-1234"`

Mock bills use short IDs: `"hr-1234"`, `"s-789"`, etc.

The `/api/bills/[billId]` route auto-detects the format and routes accordingly.

---

## Impact Analysis

The 8 impact categories scored for every bill:

| Category | What it covers |
|---|---|
| `wallet` | Taxes, income, cost of living |
| `healthcare` | Insurance, coverage, drug costs |
| `education` | Student loans, school funding |
| `jobs` | Employment, wages, sector regulation |
| `housing` | Affordability, mortgage, rent |
| `local` | State/city funding, local services |
| `rights` | Civil liberties, legal protections |
| `environment` | Climate, pollution, land use |

Each category returns: `level` (positive/negative/mixed/unclear/not_directly_affected), `score` (0–100), `explanation`.

---

## Interactive US Map

- Clicking any state shows the 4 most relevant bills for that state
- Bill relevance is scored by: topic match to state's economic profile + trending status + trend score
- State profiles are in `src/components/map/stateData.ts` — each state has `focus`, `topTopics`, `highlight`, `emoji`
- Map uses CDN TopoJSON (`geoAlbersUsa` projection) loaded client-side only

---

## Running Locally

```bash
npm install --legacy-peer-deps
npm run dev
# → http://localhost:3000
```

> **Note:** `--legacy-peer-deps` is needed due to React 19 peer dependency conflicts with some packages.

---

## Known Issues / Notes

- Gemini free tier has a daily quota (~50 requests/day). When exceeded, the app falls back to mock analysis automatically — no error shown to user.
- The `react-simple-maps` package has no official TypeScript types. Custom declarations live in `src/types/react-simple-maps.d.ts`.
- `npm install` (without `--legacy-peer-deps`) will fail due to peer dep conflicts — always use the flag.
- Next.js shows a lockfile/swc warning on first run — it auto-patches and is harmless.
