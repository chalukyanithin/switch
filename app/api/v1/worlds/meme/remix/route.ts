import { NextRequest, NextResponse } from "next/server";
import { remixMeme } from "@/lib/actions/thought.actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentMemePostId,
      renderedImageUrl,
      caption,
      authorId = "current-user",
      authorUsername = "You",
      canvasState,
    } = body;

    if (!parentMemePostId || !renderedImageUrl) {
      return NextResponse.json(
        { error: "parentMemePostId and renderedImageUrl are required" },
        { status: 400 }
      );
    }

    const memeMetadata = {
      isTemplate: true,
      templateImageUrl: renderedImageUrl,
      canvasWidth: canvasState?.canvasWidth || 600,
      canvasHeight: canvasState?.canvasHeight || 400,
      layers: canvasState?.textLayers || [],
    };

    const newRemixPost = await remixMeme({
      parentMemePostId,
      renderedImageUrl,
      caption: caption || "Remixed Meme Template",
      authorId,
      authorUsername,
      memeMetadata,
    });

    return NextResponse.json({
      success: true,
      post: newRemixPost,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create remix" }, { status: 500 });
  }
}

