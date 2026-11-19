// ==============================================================================
// SWITCH SOCIAL PLATFORM - WORLDS SERVICE
// File: lib/services/worlds.service.ts
// Handles world retrieval, metadata, and seeded world lookups
// ==============================================================================

import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import type { World } from "@/types/database";

export const DEFAULT_WORLDS: World[] = [
  {
    id: "world-tech",
    name: "Technology",
    slug: "technology",
    description: "Editorial code discussions, live sandboxes & algorithmic mastery",
    icon: "Code2",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "world-cricket",
    name: "Cricket",
    slug: "cricket",
    description: "Professional cricket journalism, match tactics & live scorecards",
    icon: "Trophy",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "world-meme",
    name: "Meme",
    slug: "meme",
    description: "Interactive meme templates, caption remixes & cultural banter",
    icon: "Sparkles",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export class WorldsService {
  /**
   * Get all active worlds with graceful fallback to default seeded worlds
   */
  static async getAllWorlds(): Promise<World[]> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return DEFAULT_WORLDS;

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("worlds")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error || !data || data.length === 0) {
        return DEFAULT_WORLDS;
      }

      return data;
    } catch {
      return DEFAULT_WORLDS;
    }
  }

  /**
   * Find world by slug
   */
  static async getWorldBySlug(slug: string): Promise<World | null> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return DEFAULT_WORLDS.find((w) => w.slug === slug.toLowerCase()) || null;
    }

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("worlds")
        .select("*")
        .eq("slug", slug.toLowerCase())
        .maybeSingle();

      if (error || !data) {
        return DEFAULT_WORLDS.find((w) => w.slug === slug.toLowerCase()) || null;
      }

      return data;
    } catch {
      return DEFAULT_WORLDS.find((w) => w.slug === slug.toLowerCase()) || null;
    }
  }
}

