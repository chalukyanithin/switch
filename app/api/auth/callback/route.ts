// ==============================================================================
// SWITCH SOCIAL PLATFORM - OAUTH CALLBACK ROUTE
// File: app/api/auth/callback/route.ts
// Handles Supabase OAuth code exchange for server session cookies (Next.js 15)
// ==============================================================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    console.error("OAuth error description:", errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription)}`
    );
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Forward to the intended target or home page
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          // In local dev, use origin
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        console.error("Supabase code exchange error:", error.message);
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent(error.message)}`
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      console.error("Callback exception:", message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(message)}`
      );
    }
  }

  // Return user to login if code is absent
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`);
}

