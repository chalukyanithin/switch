// ==============================================================================
// SWITCH SOCIAL PLATFORM - SERVER SUPABASE CLIENT
// File: lib/supabase/server.ts
// Official @supabase/ssr server client integration for Next.js 15 App Router
// ==============================================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export const getSupabaseServerConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes("your-supabase") &&
    !anonKey.includes("your-anon-key")
  );

  return {
    url: url || "https://placeholder.supabase.co",
    anonKey: anonKey || "placeholder-anon-key",
    isConfigured,
  };
};

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseServerConfig();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

