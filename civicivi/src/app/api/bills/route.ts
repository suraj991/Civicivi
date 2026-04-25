import { NextRequest, NextResponse } from "next/server";
import { MOCK_BILLS } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const trending = searchParams.get("trending");
  const q = searchParams.get("q");

  let bills = [...MOCK_BILLS];

  if (topic) {
    bills = bills.filter((b) => b.topics.includes(topic));
  }

  if (trending === "true") {
    bills = bills.filter((b) => b.trending);
  }

  if (q) {
    const query = q.toLowerCase();
    bills = bills.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.summary.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ bills, total: bills.length });
}
