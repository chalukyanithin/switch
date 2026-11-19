// ==============================================================================
// SWITCH SOCIAL PLATFORM - POSTS SERVICE
// File: lib/services/posts.service.ts
// Handles multi-world post queries, creation, media linkage & deletion
// ==============================================================================

import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import type { Post, PostMedia, Profile, World, PostType } from "@/types/database";

export interface EnrichedPost extends Post {
  author: Profile;
  world: World;
  media: PostMedia[];
  reactions_count?: number;
  comments_count?: number;
  has_liked?: boolean;
  has_bookmarked?: boolean;
}

export interface CreatePostParams {
  userId: string;
  worldSlug: string;
  content: string;
  postType?: PostType;
  mediaUrls?: string[];
}

export class PostsService {
  /**
   * Fetch posts for a specific world or all worlds
   */
  static async getPosts(params?: {
    worldSlug?: string;
    limit?: number;
    offset?: number;
    currentUserId?: string;
  }): Promise<{ posts: EnrichedPost[]; total: number }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return { posts: [], total: 0 };
    }

    const supabase = getBrowserClient();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;

    try {
      let query = supabase
        .from("posts")
        .select(
          `
          *,
          author:profiles!posts_user_id_fkey(*),
          world:worlds!posts_world_id_fkey(*),
          media:post_media(*)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (params?.worldSlug && params.worldSlug !== "all") {
        const { data: worldData } = await supabase
          .from("worlds")
          .select("id")
          .eq("slug", params.worldSlug.toLowerCase())
          .maybeSingle();

        if (worldData) {
          query = query.eq("world_id", worldData.id);
        }
      }

      const { data, count, error } = await query;
      if (error) {
        console.error("Error fetching posts:", error);
        return { posts: [], total: 0 };
      }

      const posts = (data as unknown as EnrichedPost[]) || [];
      return { posts, total: count || posts.length };
    } catch (err) {
      console.error("Posts fetch error:", err);
      return { posts: [], total: 0 };
    }
  }

  /**
   * Create a new post in a world with optional media attachments
   */
  static async createPost(
    params: CreatePostParams
  ): Promise<{ success: boolean; data?: Post; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return { success: false, error: "Database not configured." };
    }

    const supabase = getBrowserClient();

    try {
      // 1. Resolve World ID from slug
      const { data: worldData, error: worldError } = await supabase
        .from("worlds")
        .select("id")
        .eq("slug", params.worldSlug.toLowerCase())
        .single();

      if (worldError || !worldData) {
        return { success: false, error: "Selected world does not exist." };
      }

      // 2. Insert Post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: params.userId,
          world_id: worldData.id,
          content: params.content.trim(),
          post_type: params.postType || "standard",
        })
        .select()
        .single();

      if (postError || !post) {
        return { success: false, error: postError?.message || "Failed to create post." };
      }

      // 3. Attach media if provided
      if (params.mediaUrls && params.mediaUrls.length > 0) {
        const mediaInserts = params.mediaUrls.map((url, idx) => ({
          post_id: post.id,
          media_url: url,
          media_type: "image",
          display_order: idx,
        }));

        await supabase.from("post_media").insert(mediaInserts);
      }

      return { success: true, data: post };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create post.";
      return { success: false, error: message };
    }
  }

  /**
   * Delete a post (guarded by author ID & RLS)
   */
  static async deletePost(
    postId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return { success: false, error: "Database not configured." };
    }

    const supabase = getBrowserClient();
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete post.";
      return { success: false, error: message };
    }
  }
}

