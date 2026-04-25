import type { Bill } from "./types";

const BASE = "https://api.congress.gov/v3";

// --- Congress.gov raw types ---

interface RawBillListItem {
  congress: number;
  latestAction: { actionDate: string; text: string };
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  url: string;
}

interface RawSponsor {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  party?: string;
  state?: string;
}

interface RawSummary {
  text: string;
  actionDesc?: string;
  actionDate?: string;
}

interface RawBillDetail {
  congress: number;
  number: string;
  type: string;
  title: string;
  introducedDate?: string;
  latestAction: { actionDate: string; text: string };
  originChamber?: string;
  originChamberCode?: string;
  sponsors?: RawSponsor[];
  policyArea?: { name: string };
  cosponsors?: { count: number };
  summaries?: RawSummary[];
  subjects?: { legislativeSubjects: { name: string }[] };
  cboCostEstimates?: unknown[];
}

// --- Topic mapping from Congress.gov policy areas ---

const POLICY_AREA_TOPICS: Record<string, string[]> = {
  "Education": ["education"],
  "Health": ["healthcare"],
  "Housing and Community Development": ["housing"],
  "Economics and Public Finance": ["economy", "finance"],
  "Labor and Employment": ["jobs"],
  "Environmental Protection": ["environment"],
  "Energy": ["energy"],
  "Taxation": ["taxes"],
  "Science, Technology, Communications": ["technology"],
  "Agriculture and Food": ["agriculture", "rural"],
  "Armed Forces and National Security": ["national-security"],
  "Immigration": ["immigration"],
  "Civil Rights and Liberties, Minority Issues": ["civil-rights"],
  "Social Welfare": ["social welfare"],
  "Transportation and Public Works": ["transportation"],
  "Crime and Law Enforcement": ["criminal-justice"],
  "Finance and Financial Sector": ["finance"],
  "Commerce": ["economy"],
  "Small Business": ["small business", "economy"],
  "Families": ["families", "childcare"],
  "Public Lands and Natural Resources": ["environment", "rural"],
  "Government Operations and Politics": ["government"],
  "International Affairs": ["foreign-policy"],
  "Emergency Management": ["disaster"],
  "Drug Control and Dependence": ["healthcare", "criminal-justice"],
  "Seniors": ["seniors", "healthcare"],
  "Animals": ["environment"],
  "Arts, Culture, Religion": ["arts"],
  "Sports and Recreation": ["recreation"],
  "Native Americans": ["civil-rights", "rural"],
  "Water Resources Development": ["environment", "infrastructure"],
};

// --- Status parsing ---

function parseStatus(actionText: string): Bill["status"] {
  const t = actionText.toLowerCase();
  if (t.includes("signed by president") || t.includes("became public law")) return "signed";
  if (t.includes("vetoed")) return "vetoed";
  if (t.includes("passed senate") || t.includes("senate agreed")) return "passed_senate";
  if (t.includes("passed house") || t.includes("house agreed") || t.includes("passed/agreed to in house")) return "passed_house";
  if (
    t.includes("committee") ||
    t.includes("referred") ||
    t.includes("reported") ||
    t.includes("markup") ||
    t.includes("hearing")
  )
    return "committee";
  return "introduced";
}

// --- Trend score ---

function calcTrendScore(bill: RawBillDetail, cosponsorCount: number): number {
  let score = 40;
  const daysSinceAction =
    (Date.now() - new Date(bill.latestAction.actionDate).getTime()) / 86400000;
  if (daysSinceAction < 3) score += 30;
  else if (daysSinceAction < 7) score += 20;
  else if (daysSinceAction < 14) score += 12;
  else if (daysSinceAction < 30) score += 6;

  const cosponsors = cosponsorCount || 0;
  score += Math.min(20, Math.floor(cosponsors / 5));

  if (bill.summaries && bill.summaries.length > 0) score += 8;
  if (bill.cboCostEstimates && bill.cboCostEstimates.length > 0) score += 5;

  return Math.min(99, score);
}

// --- Transformers ---

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function makeShortTitle(title: string): string {
  if (title.length <= 60) return title;
  const match = title.match(/^(.*?Act\b)/i);
  if (match) return match[1];
  return title.slice(0, 57) + "…";
}

function billId(congress: number, type: string, number: string): string {
  return `${congress}-${type.toLowerCase()}-${number}`;
}

export function parseBillId(id: string): { congress: number; type: string; number: string } | null {
  const parts = id.split("-");
  if (parts.length < 3) return null;
  const congress = parseInt(parts[0]);
  if (isNaN(congress)) return null;
  const type = parts[1];
  const number = parts.slice(2).join("-");
  return { congress, type, number };
}

function transformDetail(detail: RawBillDetail, cosponsorCount = 0): Bill {
  const topicsSet = new Set<string>();
  if (detail.policyArea?.name) {
    const mapped = POLICY_AREA_TOPICS[detail.policyArea.name];
    if (mapped) mapped.forEach((t) => topicsSet.add(t));
    else topicsSet.add(detail.policyArea.name.toLowerCase());
  }
  if (detail.subjects?.legislativeSubjects) {
    detail.subjects.legislativeSubjects.slice(0, 5).forEach((s) => {
      const lc = s.name.toLowerCase();
      if (lc.length < 30) topicsSet.add(lc);
    });
  }

  const topics = Array.from(topicsSet).slice(0, 4);
  if (topics.length === 0) topics.push("legislation");

  const sponsor = detail.sponsors?.[0];
  const sponsorName = sponsor?.fullName
    ? sponsor.fullName
    : sponsor?.firstName && sponsor?.lastName
    ? `${detail.originChamberCode === "H" ? "Rep." : "Sen."} ${sponsor.firstName} ${sponsor.lastName}`
    : "Unknown";

  const rawParty = sponsor?.party?.toUpperCase() ?? "";
  const sponsorParty: Bill["sponsorParty"] =
    rawParty === "D" || rawParty === "DEMOCRAT" ? "D" :
    rawParty === "R" || rawParty === "REPUBLICAN" ? "R" : "I";

  const summary =
    detail.summaries && detail.summaries.length > 0
      ? stripHtml(detail.summaries[detail.summaries.length - 1].text).slice(0, 1200)
      : `${detail.title}. ${detail.latestAction.text}`;

  const trendScore = calcTrendScore(detail, cosponsorCount);

  const tags = Array.from(topicsSet)
    .concat(
      (detail.subjects?.legislativeSubjects ?? [])
        .slice(0, 3)
        .map((s) => s.name.toLowerCase())
    )
    .slice(0, 8);

  const chamber: Bill["chamber"] =
    (detail.originChamberCode ?? "H").toUpperCase() === "S" ? "senate" : "house";

  return {
    id: billId(detail.congress, detail.type, detail.number),
    billNumber: `${detail.type === "HR" ? "H.R." : detail.type === "S" ? "S." : detail.type} ${detail.number}`,
    title: detail.title,
    shortTitle: makeShortTitle(detail.title),
    summary,
    topics,
    tags,
    status: parseStatus(detail.latestAction.text),
    chamber,
    sponsor: sponsorName,
    sponsorParty,
    introducedDate: detail.introducedDate ?? detail.latestAction.actionDate,
    lastActionDate: detail.latestAction.actionDate,
    lastAction: detail.latestAction.text,
    trending: trendScore >= 65,
    trendScore,
  };
}

// --- API calls ---

async function congressFetch<T>(path: string, extraParams: Record<string, string> = {}): Promise<T> {
  const apiKey = process.env.CONGRESS_API_KEY;
  if (!apiKey) throw new Error("CONGRESS_API_KEY not configured");

  const params = new URLSearchParams({
    api_key: apiKey,
    format: "json",
    ...extraParams,
  });

  const res = await fetch(`${BASE}${path}?${params}`, {
    next: { revalidate: 1800 }, // cache for 30 minutes
    headers: { "User-Agent": "CiviCivi/1.0 (civic tech project)" },
  });

  if (!res.ok) {
    throw new Error(`Congress API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchBillsList(options?: {
  congress?: number;
  limit?: number;
  sort?: string;
  subject?: string;
}): Promise<Bill[]> {
  const {
    congress = 119,
    limit = 20,
    sort = "updateDate+desc",
  } = options ?? {};

  const data = await congressFetch<{ bills: RawBillListItem[] }>(`/bill/${congress}`, {
    limit: String(limit),
    sort,
  });

  // Fetch details for each bill in parallel (batch of up to 20)
  const details = await Promise.allSettled(
    data.bills.map((item) =>
      fetchBillDetails(item.congress, item.type, item.number)
    )
  );

  return details
    .filter((r): r is PromiseFulfilledResult<Bill> => r.status === "fulfilled")
    .map((r) => r.value);
}

export async function fetchBillDetails(
  congress: number,
  type: string,
  number: string
): Promise<Bill> {
  const [billData, summaryData, cosponsorData] = await Promise.allSettled([
    congressFetch<{ bill: RawBillDetail }>(`/bill/${congress}/${type.toLowerCase()}/${number}`),
    congressFetch<{ summaries: RawSummary[] }>(`/bill/${congress}/${type.toLowerCase()}/${number}/summaries`),
    congressFetch<{ pagination: { count: number } }>(`/bill/${congress}/${type.toLowerCase()}/${number}/cosponsors`, { limit: "1" }),
  ]);

  if (billData.status !== "fulfilled") throw billData.reason;

  const detail = billData.value.bill;

  if (summaryData.status === "fulfilled" && summaryData.value.summaries?.length > 0) {
    detail.summaries = summaryData.value.summaries;
  }

  const cosponsorCount =
    cosponsorData.status === "fulfilled"
      ? cosponsorData.value.pagination?.count ?? 0
      : 0;

  return transformDetail(detail, cosponsorCount);
}

export async function searchBills(query: string, congress = 119): Promise<Bill[]> {
  const data = await congressFetch<{ bills: RawBillListItem[] }>(`/bill/${congress}`, {
    limit: "20",
    sort: "updateDate+desc",
  });

  const q = query.toLowerCase();
  const filtered = data.bills.filter((b) =>
    b.title.toLowerCase().includes(q)
  );

  const details = await Promise.allSettled(
    filtered.slice(0, 10).map((item) =>
      fetchBillDetails(item.congress, item.type, item.number)
    )
  );

  return details
    .filter((r): r is PromiseFulfilledResult<Bill> => r.status === "fulfilled")
    .map((r) => r.value);
}
