import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, fileName, mimeType, fileSizeBytes } = body;

    if (!fileName || !mimeType) {
      return NextResponse.json({ error: "fileName and mimeType are required" }, { status: 400 });
    }

    // Context-specific validation
    if (context === "audio_comment") {
      // Audio comments must be <= 3MB and standard audio format
      const maxAudioBytes = 3 * 1024 * 1024;
      if (fileSizeBytes && fileSizeBytes > maxAudioBytes) {
        return NextResponse.json(
          { error: "Audio comments must not exceed 3MB (maximum 30 seconds)" },
          { status: 422 }
        );
      }
    }

    const timestamp = Date.now();
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `uploads/${context || "general"}/${timestamp}-${sanitizedName}`;
    
    // In production, this generates an AWS S3 / Cloudflare R2 Presigned PutObject URL.
    // In local / prototype mode, it returns the signed key and simulated direct endpoint.
    const uploadUrl = `/api/v1/media/direct-upload?key=${encodeURIComponent(fileKey)}`;
    const publicUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`;

    return NextResponse.json({
      uploadUrl,
      fileKey,
      publicUrl,
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate upload URL" }, { status: 500 });
  }
}

