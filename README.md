# CiviCivi

**Government data tells us what happened. CiviCivi tells you what it means for *you*.**

> Live site: **[civicivi.vercel.app](https://civicivi.vercel.app)** · GitHub: [suraj991/Civicivi](https://github.com/suraj991/Civicivi)

---

## The Problem

Most Americans can't read a bill. Legislation is written in legal language, buried in government websites, and never explained in terms of real life. People don't know if a new law will raise their rent, change their insurance, or affect their job — until it already has.

## The Solution

CiviCivi connects your personal profile to real congressional bills and tells you exactly how each one affects your life — scored across 8 impact categories, explained in plain English, and available as an AI audio summary.

**No jargon. No spin. Just your impact.**

---

## How It Works

1. **Build your profile** — Enter your state, income range, job sector, healthcare status, and what issues matter to you. Takes 2 minutes. No account needed.
2. **Browse real bills** — Live data from Congress.gov. Search, filter by topic, or click any state on the interactive US map.
3. **Get your personal impact** — AI analyzes the bill against *your* profile and scores it across 8 life areas with plain-English explanations.
4. **Listen** — AI-generated audio summary explains the bill in under 60 seconds.

### 8 Impact Categories Scored Per Bill

| Category | What It Measures |
|---|---|
| Wallet | Taxes, cost of living, direct financial effects |
| Healthcare | Insurance, coverage, prescription drug costs |
| Education | Student loans, school funding, tuition |
| Jobs | Employment, wages, your industry |
| Housing | Affordability, mortgage rates, rent |
| Local | Your city/state funding and services |
| Rights | Civil liberties, legal protections |
| Environment | Climate, pollution, land use near you |

---

## Built With

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI Analysis | Google Gemini `gemini-2.0-flash` |
| AI Audio | ElevenLabs |
| Bill Data | Congress.gov API (official, free, live) |
| Map | `react-simple-maps` — interactive US map |
| Charts | `recharts` RadarChart |
| Storage | Browser localStorage — no database needed |

---

## Run Locally

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up API keys (all optional — app works without them)
cp .env.local.example .env.local

# 3. Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**API Keys** (all free tiers, all optional):

| Key | Purpose | Get it |
|---|---|---|
| `GEMINI_API_KEY` | AI impact analysis | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `ELEVENLABS_API_KEY` | Audio summaries | [elevenlabs.io](https://elevenlabs.io/app/settings/api-keys) |
| `CONGRESS_API_KEY` | Live bill data | [api.congress.gov/sign-up](https://api.congress.gov/sign-up/) |

Without API keys the app runs on realistic mock data — great for demos.

---

## Resilient by Design

Every external service has a silent fallback so the app never breaks:

| Service fails | What happens |
|---|---|
| Congress.gov | Falls back to 8 realistic mock bills |
| Gemini AI | Generates a profile-aware mock analysis |
| ElevenLabs | Audio button hides gracefully |

---

## Deploy Your Own

```bash
# The .npmrc file handles peer dependency issues automatically on Vercel
git push origin main
# → Import on vercel.com → Add env vars → Deploy
```

Live in ~2 minutes. See [Deploying on Vercel](https://vercel.com/docs) for details.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage + interactive US map
│   ├── profile/page.tsx          # Profile setup wizard
│   ├── bills/page.tsx            # Bill explorer
│   ├── bills/[id]/page.tsx       # Bill detail + AI impact analysis
│   └── api/
│       ├── bills/                # Congress.gov or mock data
│       ├── impact/analyze/       # Gemini AI analysis
│       ├── audio/generate/       # ElevenLabs audio
│       └── discussion/           # Community posts
├── components/
│   ├── map/                      # US map with state panels
│   ├── impact/                   # Radar chart + score bars
│   └── layout/                   # Header, Footer
└── lib/
    ├── congressApi.ts            # Congress.gov API client
    ├── mockData.ts               # Fallback data
    └── types.ts                  # TypeScript interfaces
```

For full technical documentation see [CIVICIVI.md](./CIVICIVI.md).
