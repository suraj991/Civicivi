# CiviCivi

**Government data tells us what happened. CiviCivi tells you what it means for *you*.**

> Live site: **[civicivi.vercel.app](https://civicivi.vercel.app)**

CiviCivi is a civic tech web app that takes US government bills and explains exactly how they affect your personal life — your wallet, job, healthcare, housing, and more — based on your specific situation.

No more reading confusing bill summaries. Tell us who you are, and we'll tell you what the law means for you.

---

## What It Does

1. **Build your profile** — Enter your state, income range, job sector, healthcare situation, and what issues matter to you.
2. **Browse real bills** — See current legislation pulled live from Congress.gov, or explore trending bills.
3. **Get personalized impact** — AI analyzes the bill against *your* profile and scores it across 8 life areas.
4. **Listen to a summary** — AI-generated audio explains the bill in plain English in under 60 seconds.
5. **Explore by state** — Click any state on the interactive US map to see bills most relevant to that state's residents.

### The 8 Impact Categories

| Category | What It Measures |
|---|---|
| Wallet | Taxes, cost of living, direct financial effects |
| Healthcare | Insurance, coverage, prescription costs |
| Education | Student loans, school funding, tuition |
| Jobs | Employment, wages, your industry |
| Housing | Affordability, mortgage rates, rent |
| Local | Your city/state funding and services |
| Rights | Civil liberties, legal protections |
| Environment | Climate, pollution, land use near you |

---

## Getting Started

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is required. Some packages have React 19 peer dependency conflicts that need this flag to resolve.

### 2. Set up your API keys

Copy the example environment file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```bash
# For AI-powered impact analysis (get a free key at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_key_here

# For AI audio summaries (get a free key at https://elevenlabs.io/app/settings/api-keys)
ELEVENLABS_API_KEY=your_key_here

# For real, live congressional bill data (free at https://api.congress.gov/sign-up/)
CONGRESS_API_KEY=your_key_here
```

**All API keys are optional.** The app works without any of them using realistic mock data and mock analysis — great for development and demos.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                        # Pages (Next.js App Router)
│   ├── page.tsx                # Homepage with hero + US map
│   ├── profile/page.tsx        # Profile setup wizard
│   ├── bills/page.tsx          # Bill explorer with search
│   ├── bills/[id]/page.tsx     # Bill detail + impact analysis
│   └── api/
│       ├── bills/              # Fetch bills from Congress.gov or mock
│       ├── impact/analyze/     # Gemini AI impact analysis
│       ├── audio/generate/     # ElevenLabs audio summaries
│       └── discussion/         # Community discussion posts
├── components/
│   ├── map/                    # Interactive US map (react-simple-maps)
│   ├── impact/                 # Radar chart + score bars
│   ├── bills/                  # Bill cards
│   ├── audio/                  # Audio player
│   └── layout/                 # Header, Footer
└── lib/
    ├── types.ts                # TypeScript interfaces for everything
    ├── congressApi.ts          # Congress.gov API client
    ├── mockData.ts             # Fallback mock bills and analysis
    └── storage.ts              # Saves your profile to localStorage
```

---

## How the Fallbacks Work

The app is designed to always work, even if an API key is missing or a service is down:

| Service | What happens if it fails |
|---|---|
| Congress.gov | Shows 8 built-in mock bills |
| Gemini AI | Generates a profile-aware mock analysis |
| ElevenLabs | Audio button is gracefully hidden |

You'll never see a broken page — the app silently falls back to safe defaults.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI Analysis:** Google Gemini (`gemini-2.0-flash`)
- **AI Audio:** ElevenLabs
- **Bill Data:** Congress.gov API
- **Map:** `react-simple-maps` with US AlbersUsa projection
- **Charts:** `recharts` RadarChart
- **No database** — profiles saved to browser localStorage

---

## Deploying

The app is live at **[civicivi.vercel.app](https://civicivi.vercel.app)**.

To deploy your own instance on [Vercel](https://vercel.com):

1. Push this repo to GitHub
2. Import it on vercel.com
3. Add your environment variables in the Vercel dashboard
4. Deploy — it goes live in ~2 minutes

> **Note:** The repo includes a `.npmrc` file with `legacy-peer-deps=true` which is required for Vercel's build to succeed due to React 19 peer dependency conflicts.

---

## Notes for Developers

- **Bill IDs:** Real Congress.gov bills use the format `"119-hr-1234"` (congress-type-number). Mock bills use short IDs like `"hr-1234"`.
- **Gemini free tier** has a daily quota. When it's exceeded, the app silently falls back to mock analysis — no error is shown to the user.
- **TypeScript types** for `react-simple-maps` are custom-written in `src/types/react-simple-maps.d.ts` since the package doesn't ship its own.
- For full technical documentation, see [CIVICIVI.md](./CIVICIVI.md).
