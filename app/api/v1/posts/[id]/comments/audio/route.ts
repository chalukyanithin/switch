import { NextRequest, NextResponse } from "next/server";
import { addAudioComment } from "@/lib/actions/thought.actions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await req.json();
    const { mediaUrl, durationMs, waveform, mimeType, authorId = "current-user", username = "You" } = body;

    if (!mediaUrl) {
      return NextResponse.json({ error: "mediaUrl is required" }, { status: 400 });
    }

    if (typeof durationMs !== "number" || durationMs <= 0) {
      return NextResponse.json({ error: "Valid durationMs is required" }, { status: 400 });
    }

    // Enforce 30-second hard limit
    if (durationMs > 30000) {
      return NextResponse.json(
        { error: "Audio comments must not exceed 30,000 milliseconds (30 seconds)" },
        { status: 422 }
      );
    }

    const audioData = {
      mediaUrl,
      durationMs,
      waveform: Array.isArray(waveform) && waveform.length > 0 ? waveform : [0.2, 0.4, 0.8, 0.6, 0.9, 0.5, 0.3],
      mimeType: mimeType || "audio/webm",
    };

    const updatedPost = await addAudioComment(postId, authorId, audioData, username);

    return NextResponse.json({
      success: true,
      comment: {
        type: "audio",
        audio: audioData,
        author: {
          _id: authorId,
          username,
        },
        createdAt: new Date().toISOString(),
      },
      post: updatedPost,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add audio comment" }, { status: 500 });
  }
}

