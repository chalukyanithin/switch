// ==============================================================================
// SWITCH SOCIAL PLATFORM - BROWSER SUPABASE CLIENT
// File: lib/supabase/client.ts
// Official @supabase/ssr browser client integration
// ==============================================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export const getSupabaseBrowserConfig = () => {
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

export function createClient() {
  const { url, anonKey } = getSupabaseBrowserConfig();
  return createBrowserClient<Database>(url, anonKey);
}

// Singleton browser client instance for lightweight client-side access
let browserClientInstance: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (typeof window === "undefined") {
    return createClient();
  }
  if (!browserClientInstance) {
    browserClientInstance = createClient();
  }
  return browserClientInstance;
}

