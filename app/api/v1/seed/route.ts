// ==============================================================================
// SWITCH SOCIAL PLATFORM - SEED & STATUS API
// File: app/api/v1/seed/route.ts
// Verifies database status and returns world & post statistics
// ==============================================================================

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_SWITCH_POSTS } from "@/lib/data/worldsData";
import { fetchThoughts } from "@/lib/actions/thought.actions";

export async function GET() {
  let supabaseConnected = false;
  let tablesFound = false;
  let supabaseWorlds: any[] = [];
  let errorMsg = null;

  try {
    const supabase = await createClient();
    const { data: worlds, error } = await supabase.from("worlds").select("*");

    if (error) {
      errorMsg = error.message;
    } else {
      supabaseConnected = true;
      tablesFound = true;
      supabaseWorlds = worlds || [];
    }
  } catch (err: any) {
    errorMsg = err.message;
  }

  const allActiveThoughts = await fetchThoughts();

  return NextResponse.json({
    status: tablesFound ? "supabase_active" : "memory_fallback_active",
    supabase: {
      connected: supabaseConnected,
      tablesExist: tablesFound,
      worldsCount: supabaseWorlds.length,
      worlds: supabaseWorlds.map((w: any) => ({ name: w.name, slug: w.slug })),
      error: errorMsg,
      migrationInstruction: tablesFound
        ? "All database tables are operational."
        : "To activate PostgreSQL persistence, copy supabase/migrations/0001_initial_schema.sql into your Supabase SQL Editor and execute it.",
    },
    application: {
      totalPosts: allActiveThoughts.length,
      technologyPosts: allActiveThoughts.filter((p) => p.world.toLowerCase() === "technology").length,
      memePosts: allActiveThoughts.filter((p) => p.world.toLowerCase() === "meme").length,
      cricketPosts: allActiveThoughts.filter((p) => p.world.toLowerCase() === "cricket").length,
    },
  });
}

