// ==============================================================================
// SWITCH SOCIAL PLATFORM - REST POSTS API
// File: app/api/v1/posts/route.ts
// Handles listing and creating posts via REST API
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { fetchThoughts, createThought } from "@/lib/actions/thought.actions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const world = searchParams.get("world") || undefined;
    const posts = await fetchThoughts(world);
    return NextResponse.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error("POST /api/v1/posts error:", error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.content || !body.world) {
      return NextResponse.json(
        { success: false, error: "Content and world are required fields" },
        { status: 400 }
      );
    }

    const post = await createThought({
      content: body.content,
      world: body.world,
      authorId: body.authorId,
      image: body.image,
      tech: body.tech,
      meme: body.meme,
      cricket: body.cricket,
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/v1/posts error:", error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
