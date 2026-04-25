import { NextRequest, NextResponse } from "next/server";
import { MOCK_BILLS } from "@/lib/mockData";
import { fetchBillsList, searchBills } from "@/lib/congressApi";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const trending = searchParams.get("trending");
  const q = searchParams.get("q");
  const source = searchParams.get("source"); // "real" | "mock"

  const useReal = !!process.env.CONGRESS_API_KEY && source !== "mock";

  if (useReal) {
    try {
      let bills;
      if (q?.trim()) {
        bills = await searchBills(q.trim());
      } else {
        bills = await fetchBillsList({ limit: 20, sort: "updateDate+desc" });
      }
      if (topic) bills = bills.filter((b) => b.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase())));
      if (trending === "true") bills = bills.filter((b) => b.trending);
      return NextResponse.json({ bills, total: bills.length, source: "congress.gov" });
    } catch (err) {
      console.warn("Congress API failed, using mock:", err);
    }
  }

  let bills = [...MOCK_BILLS];
  if (topic) bills = bills.filter((b) => b.topics.includes(topic));
  if (trending === "true") bills = bills.filter((b) => b.trending);
  if (q) {
    const query = q.toLowerCase();
    bills = bills.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.summary.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query))
    );
  }
  return NextResponse.json({ bills, total: bills.length, source: "mock" });
}
