import { NextRequest, NextResponse } from "next/server";
import { MOCK_BILLS } from "@/lib/mockData";
import { fetchBillDetails, parseBillId } from "@/lib/congressApi";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ billId: string }> }
) {
  const { billId } = await params;
  const decoded = decodeURIComponent(billId);

  if (process.env.CONGRESS_API_KEY) {
    const parsed = parseBillId(decoded);
    if (parsed) {
      try {
        const bill = await fetchBillDetails(parsed.congress, parsed.type, parsed.number);
        return NextResponse.json({ bill, source: "congress.gov" });
      } catch (err) {
        console.warn(`Congress API failed for ${decoded}:`, err);
      }
    }
  }

  const bill = MOCK_BILLS.find((b) => b.id === decoded);
  if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  return NextResponse.json({ bill, source: "mock" });
}
