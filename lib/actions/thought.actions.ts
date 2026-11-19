// ==============================================================================
// SWITCH SOCIAL PLATFORM - THOUGHT & POST SERVER ACTIONS
// File: lib/actions/thought.actions.ts
// Supabase-backed post actions with in-memory fallback for preview
// ==============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_SWITCH_POSTS, SwitchPost, AudioCommentData, MemeMetadata } from "../data/worldsData";

// In-memory runtime cache for fallback posts so user actions persist in preview
let memoryPosts: SwitchPost[] = [...INITIAL_SWITCH_POSTS];

export async function createThought(params: {
  content: string;
  world: string;
  authorId?: string;
  author?: string;
  image?: string;
  cooking?: any;
  art?: any;
  tech?: any;
  music?: any;
  fitness?: any;
  meme?: any;
  cricket?: any;
}) {
  let createdPost: any = null;
  const resolvedAuthorId = params.authorId || params.author || "current-user";

  try {
    const supabase = await createClient();

    // Resolve world ID
    const { data: worldData } = await supabase
      .from("worlds")
      .select("id")
      .ilike("name", params.world)
      .maybeSingle();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedAuthorId);

    if (worldData && isUuid) {
      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          user_id: resolvedAuthorId,
          world_id: worldData.id,
          content: params.content,
          post_type: (params.world.toLowerCase() as any) || "standard",
        })
        .select()
        .single();

      if (post && !error) {
        if (params.image) {
          await supabase.from("post_media").insert({
            post_id: post.id,
            media_url: params.image,
            media_type: "image",
          });
        }
        createdPost = post;
      }
    }
  } catch (error) {
    console.warn("Supabase createThought fallback:", error);
  }

  const newPost: SwitchPost = {
    _id: createdPost?.id || `mem-${Date.now()}`,
    content: params.content,
    world: params.world,
    image: params.image,
    createdAt: new Date().toISOString(),
    author: {
      _id: resolvedAuthorId,
      username: "You",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Explorer on Switch.",
    },
    likes: [],
    comments: [],
    cooking: params.cooking,
    art: params.art,
    tech: params.tech,
    music: params.music,
    fitness: params.fitness,
    meme: params.meme,
    cricket: params.cricket,
  };

  memoryPosts = [newPost, ...memoryPosts];
  try {
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath(`/world/${params.world.toLowerCase()}`);
  } catch {
    // revalidatePath may be a no-op in non-page contexts
  }
  return newPost;
}

export async function fetchThoughts(worldFilter?: string) {
  let dbThoughts: any[] = [];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_user_id_fkey(*),
        world:worlds!posts_world_id_fkey(*),
        media:post_media(*),
        comments:comments(*, author:profiles(*)),
        reactions:reactions(*)
      `)
      .order("created_at", { ascending: false });

    if (worldFilter && worldFilter !== "All") {
      const { data: w } = await supabase
        .from("worlds")
        .select("id")
        .ilike("name", worldFilter)
        .maybeSingle();

      if (w) {
        query = query.eq("world_id", w.id);
      }
    }

    const { data: supabasePosts, error } = await query;
    if (supabasePosts && !error && supabasePosts.length > 0) {
      dbThoughts = supabasePosts.map((p: any) => ({
        _id: p.id,
        content: p.content,
        world: p.world?.name || "General",
        createdAt: p.created_at,
        author: {
          _id: p.author?.id || "user-supabase",
          username: p.author?.username || "SwitchUser",
          photo:
            p.author?.avatar_url ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.author?.id || "SwitchUser"}`,
          bio: p.author?.bio || "",
        },
        image: p.media?.[0]?.media_url || null,
        likes: (p.reactions || []).map((r: any) => r.user_id),
        comments: (p.comments || []).map((c: any) => ({
          _id: c.id,
          text: c.content,
          type: "text",
          author: {
            _id: c.author?.id || c.user_id,
            username: c.author?.username || "Commenter",
            photo: c.author?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.user_id}`,
          },
          createdAt: c.created_at,
        })),
      }));
    }
  } catch (error) {
    console.warn("fetchThoughts fallback:", error);
  }

  // Combine with memory/demo posts for seamless preview
  const combined = [...dbThoughts];
  const existingIds = new Set(dbThoughts.map((t) => String(t._id)));

  for (const post of memoryPosts) {
    if (!existingIds.has(post._id)) {
      if (
        !worldFilter ||
        worldFilter === "All" ||
        post.world.toLowerCase() === worldFilter.toLowerCase()
      ) {
        combined.push(post);
      }
    }
  }

  return combined;
}

export async function fetchThoughtById(id: string) {
  try {
    const supabase = await createClient();
    const { data: p } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_user_id_fkey(*),
        world:worlds!posts_world_id_fkey(*),
        media:post_media(*),
        comments:comments(*, author:profiles(*)),
        reactions:reactions(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (p) {
      return {
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
        likes: (p.reactions || []).map((r: any) => r.user_id),
        comments: (p.comments || []).map((c: any) => ({
          _id: c.id,
          text: c.content,
          type: "text",
          author: {
            _id: c.author?.id || c.user_id,
            username: c.author?.username || "Commenter",
            photo: c.author?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.user_id}`,
          },
          createdAt: c.created_at,
        })),
      };
    }
  } catch (e) {
    console.warn("fetchThoughtById fallback:", e);
  }

  const memoryMatch = memoryPosts.find((p) => p._id === id);
  if (memoryMatch) return memoryMatch;
  return null;
}

export async function likeThought(thoughtId: string, userId: string) {
  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    const isPostUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(thoughtId);

    if (isUuid && isPostUuid) {
      const { data: existing } = await supabase
        .from("reactions")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", thoughtId)
        .eq("reaction_type", "upvote")
        .maybeSingle();

      if (existing) {
        await supabase.from("reactions").delete().eq("id", existing.id);
      } else {
        await supabase.from("reactions").insert({
          user_id: userId,
          post_id: thoughtId,
          reaction_type: "upvote",
        });
      }
    }
  } catch (error) {
    console.warn("likeThought fallback:", error);
  }

  // Fallback in memory
  const post = memoryPosts.find((p) => p._id === thoughtId);
  if (post) {
    if (!post.likes) post.likes = [];
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }
    return post;
  }
  return { likes: [userId] };
}

export async function addComment(thoughtId: string, userId: string, text: string, username = "You") {
  let createdCommentId: string | null = null;

  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    const isPostUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(thoughtId);

    if (isUuid && isPostUuid) {
      const { data: c } = await supabase
        .from("comments")
        .insert({
          post_id: thoughtId,
          user_id: userId,
          content: text,
        })
        .select("id")
        .single();
      if (c) createdCommentId = c.id;
      try {
        revalidatePath("/");
      } catch {}
    }
  } catch (error) {
    console.warn("addComment fallback:", error);
  }

  const post = memoryPosts.find((p) => p._id === thoughtId);
  const newComment = {
    _id: createdCommentId || `comm-${Date.now()}`,
    text,
    type: "text" as const,
    author: {
      _id: userId,
      username,
      photo: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
    },
    createdAt: "Just now",
  };

  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
  }
  return newComment;
}

export async function addAudioComment(thoughtId: string, userId: string, audioData: AudioCommentData, username = "Voice Member") {
  const post = memoryPosts.find((p) => p._id === thoughtId);
  const newComment = {
    _id: `aud-${Date.now()}`,
    type: "audio" as const,
    audio: audioData,
    author: {
      _id: userId,
      username,
      photo: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
    },
    createdAt: "Just now",
  };
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
  }
  return newComment;
}

export async function remixMeme(params: {
  parentMemeId?: string;
  parentMemePostId?: string;
  templateImageUrl?: string;
  renderedImageUrl?: string;
  layers?: any[];
  caption?: string;
  authorId?: string;
  authorUsername?: string;
  memeMetadata?: any;
}) {
  const image = params.renderedImageUrl || params.templateImageUrl || "";
  return createThought({
    content: params.caption || "Remixed Meme via Switch Meme World",
    world: "Meme",
    authorId: params.authorId || "current-user",
    image,
    meme: params.memeMetadata || {
      isTemplate: false,
      templateImageUrl: image,
      parentMemeId: params.parentMemePostId || params.parentMemeId,
      layers: params.layers,
    },
  });
}
