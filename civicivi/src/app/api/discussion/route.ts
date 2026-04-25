import { NextRequest, NextResponse } from "next/server";
import { MOCK_DISCUSSION_POSTS } from "@/lib/mockData";

const posts = [...MOCK_DISCUSSION_POSTS];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const billId = searchParams.get("billId");

  const filtered = billId ? posts.filter((p) => p.billId === billId) : posts;

  return NextResponse.json({ posts: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billId, content, type, displayName } = body;

    if (!billId || !content || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPost = {
      id: `post-${Date.now()}`,
      billId,
      userId: "anonymous",
      displayName: displayName || "Anonymous",
      content: content.slice(0, 1000),
      type,
      upvotes: 0,
      timestamp: new Date().toISOString(),
      aiModerated: false,
    };

    posts.unshift(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
