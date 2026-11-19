// ==============================================================================
// SWITCH SOCIAL PLATFORM - SUPABASE MIDDLEWARE HELPER
// File: lib/supabase/middleware.ts
// Handles fast path routing and session guards without blocking public clicks
// ==============================================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Protected routes: unauthenticated users cannot access create post or settings
  const isProtectedRoute =
    pathname.startsWith("/create") ||
    pathname.startsWith("/settings");

  // Auth routes: authenticated users visiting /login or /signup get redirected to home
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // Fast path: for all public feed, world, explore, search, and post routes,
  // do not block the request with a remote network roundtrip to Supabase.
  if (!isProtectedRoute && !isAuthRoute) {
    return supabaseResponse;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase credentials are not configured, allow access
  if (!url || !anonKey || url.includes("your-supabase")) {
    return supabaseResponse;
  }

  // Fast check for auth cookies before making a remote network call
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes("-auth-token") || c.name.startsWith("sb-")
  );

  // If on a protected route and definitely no session cookies exist, redirect immediately
  if (isProtectedRoute && !hasAuthCookie) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If on an auth route and no session cookies exist, let user see login/signup page immediately
  if (isAuthRoute && !hasAuthCookie) {
    return supabaseResponse;
  }

  // Only perform remote token verification when auth cookies actually exist
  try {
    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtectedRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.warn("Middleware auth check skipped:", error);
  }

  return supabaseResponse;
}
