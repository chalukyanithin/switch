// ==============================================================================
// SWITCH SOCIAL PLATFORM - POST COMMENTS API
// File: app/api/v1/posts/[id]/comments/route.ts
// Handles text comments submission for a post
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/actions/thought.actions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.content && !body.text) {
      return NextResponse.json(
        { success: false, error: "Comment text is required" },
        { status: 400 }
      );
    }

    const text = body.content || body.text;
    const userId = body.userId || "current-user";
    const username = body.username || "You";

    const comment = await addComment(id, userId, text, username);

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

