// ==============================================================================
// SWITCH SOCIAL PLATFORM - GLOBAL SEARCH SERVER ACTION
// File: lib/actions/search.actions.ts
// Supabase-backed universal search across creators, posts, codes & memes
// ==============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { INITIAL_SWITCH_POSTS } from "../data/worldsData";

export async function globalSearch(query: string) {
  let users: any[] = [];
  let thoughts: any[] = [];

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return { users: [], thoughts: [] };
  }

  try {
    const supabase = await createClient();

    // 1. Search profiles by username or display_name
    const { data: dbUsers } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .or(`username.ilike.%${cleanQuery}%,display_name.ilike.%${cleanQuery}%,bio.ilike.%${cleanQuery}%`)
      .limit(8);

    if (dbUsers && dbUsers.length > 0) {
      users = dbUsers.map((u: any) => ({
        _id: u.id,
        username: u.username,
        name: u.display_name || u.username,
        photo: u.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.id}`,
        bio: u.bio || "",
      }));
    }

    // 2. Search posts by content
    const { data: dbPosts } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_user_id_fkey(*),
        world:worlds!posts_world_id_fkey(*),
        media:post_media(*)
      `)
      .ilike("content", `%${cleanQuery}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (dbPosts && dbPosts.length > 0) {
      thoughts = dbPosts.map((p: any) => ({
        _id: p.id,
        content: p.content,
        world: p.world?.name || "General",
        createdAt: p.created_at,
        author: {
          _id: p.author?.id || "user-supabase",
          username: p.author?.username || "SwitchUser",
          photo: p.author?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.author?.id}`,
          bio: p.author?.bio || "",
        },
        image: p.media?.[0]?.media_url || null,
        likes: [],
        comments: [],
      }));
    }
  } catch (error) {
    console.warn("Supabase search fallback:", error);
  }

  // 3. Merge with fallback datasets (bot accounts & rich seed posts)
  const fallbackThoughts = INITIAL_SWITCH_POSTS.filter((post) =>
    post.content.toLowerCase().includes(cleanQuery) ||
    post.world.toLowerCase().includes(cleanQuery) ||
    post.author.username.toLowerCase().includes(cleanQuery) ||
    (post.tech && (
      post.tech.techStack?.some((s: string) => s.toLowerCase().includes(cleanQuery)) ||
      post.tech.topics?.some((t: string) => t.toLowerCase().includes(cleanQuery))
    )) ||
    (post.meme && (
      post.meme.category?.toLowerCase().includes(cleanQuery) ||
      post.meme.tags?.some((t: string) => t.toLowerCase().includes(cleanQuery)) ||
      post.meme.layers?.some((l: any) => l.text?.toLowerCase().includes(cleanQuery))
    )) ||
    (post.cricket && (
      post.cricket.matchTitle?.toLowerCase().includes(cleanQuery) ||
      post.cricket.scoreSnippet?.toLowerCase().includes(cleanQuery) ||
      post.cricket.venue?.toLowerCase().includes(cleanQuery)
    ))
  );

  const fallbackUsers = [
    { _id: "user-thecringe-tv", username: "thecringe_tv", photo: "https://api.dicebear.com/7.x/bottts/svg?seed=thecringe_tv", bio: "Cringe is an art form. We specialize in pure chaos." },
    { _id: "user-existential-doge", username: "daily.doge", photo: "https://api.dicebear.com/7.x/adventurer/svg?seed=dailydoge", bio: "Much philosophic. Very point. Wow." },
    { _id: "user-meme-eng", username: "meme.engineer", photo: "https://api.dicebear.com/7.x/bottts/svg?seed=memeengineer", bio: "Building high-throughput memes using zero-copy humor." },
    { _id: "user-sarah", username: "sarah_chen", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80", bio: "Distributed systems architect. Tokio & Rust compiler contributor." },
    { _id: "user-alex", username: "alex_dev", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", bio: "V8 internals explorer & high-throughput distributed actor systems." },
    { _id: "user-cricket-pundit", username: "CricketPundit", photo: "https://api.dicebear.com/7.x/bottts/svg?seed=CricketPundit", bio: "Hawk-Eye trajectory models, pitch micro-climate analysis, and Test cricket." },
    { _id: "user-ravi-commentary", username: "Ravi_Commentary", photo: "https://api.dicebear.com/7.x/bottts/svg?seed=RaviCommentary", bio: "Tracer bullet voice reactions and 30-second dugout breakdown audio." },
  ].filter((u) => u.username.toLowerCase().includes(cleanQuery) || u.bio.toLowerCase().includes(cleanQuery));

  // Deduplicate and merge
  const userIds = new Set(users.map((u) => String(u._id)));
  for (const u of fallbackUsers) {
    if (!userIds.has(u._id)) users.push(u);
  }

  const thoughtIds = new Set(thoughts.map((t) => String(t._id)));
  for (const t of fallbackThoughts) {
    if (!thoughtIds.has(t._id)) thoughts.push(t);
  }

  return {
    users,
    thoughts,
  };
}
