// ==============================================================================
// SWITCH SOCIAL PLATFORM - SOCIAL & INTERACTIONS SERVICE
// File: lib/services/social.service.ts
// Follow relationships, reactions, comments, bookmarks & notifications
// ==============================================================================

import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import type { Comment, Profile } from "@/types/database";

export interface EnrichedComment extends Comment {
  author: Profile;
}

export class SocialService {
  /**
   * Follow a user
   */
  static async followUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (followerId === followingId) {
      return { success: false, error: "You cannot follow yourself." };
    }

    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { success: false, error: "Database not configured." };

    const supabase = getBrowserClient();
    try {
      const { error } = await supabase.from("follows").insert({
        follower_id: followerId,
        following_id: followingId,
      });

      if (error && error.code !== "23505") {
        return { success: false, error: error.message };
      }

      // Create notification
      await supabase.from("notifications").insert({
        recipient_id: followingId,
        actor_id: followerId,
        notification_type: "follow",
      });

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to follow user.";
      return { success: false, error: message };
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ success: boolean; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { success: false, error: "Database not configured." };

    const supabase = getBrowserClient();
    try {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to unfollow user.";
      return { success: false, error: message };
    }
  }

  /**
   * Check if user A follows user B
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return false;

    const supabase = getBrowserClient();
    try {
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .maybeSingle();

      return Boolean(data);
    } catch {
      return false;
    }
  }

  /**
   * Get follow counts for a user
   */
  static async getFollowCounts(
    userId: string
  ): Promise<{ followers: number; following: number }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { followers: 0, following: 0 };

    const supabase = getBrowserClient();
    try {
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", userId),
      ]);

      return {
        followers: followers || 0,
        following: following || 0,
      };
    } catch {
      return { followers: 0, following: 0 };
    }
  }

  /**
   * Toggle reaction on a post
   */
  static async toggleReaction(
    userId: string,
    postId: string,
    reactionType: string
  ): Promise<{ success: boolean; added: boolean; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { success: false, added: false, error: "Database not configured." };

    const supabase = getBrowserClient();
    try {
      // Check if already reacted
      const { data: existing } = await supabase
        .from("reactions")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .eq("reaction_type", reactionType)
        .maybeSingle();

      if (existing) {
        await supabase.from("reactions").delete().eq("id", existing.id);
        return { success: true, added: false };
      } else {
        await supabase.from("reactions").insert({
          user_id: userId,
          post_id: postId,
          reaction_type: reactionType,
        });
        return { success: true, added: true };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Reaction update failed.";
      return { success: false, added: false, error: message };
    }
  }

  /**
   * Toggle bookmark on a post
   */
  static async toggleBookmark(
    userId: string,
    postId: string
  ): Promise<{ success: boolean; bookmarked: boolean; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { success: false, bookmarked: false, error: "Database not configured." };

    const supabase = getBrowserClient();
    try {
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", userId)
        .eq("post_id", postId)
        .maybeSingle();

      if (existing) {
        await supabase.from("bookmarks").delete().eq("id", existing.id);
        return { success: true, bookmarked: false };
      } else {
        await supabase.from("bookmarks").insert({
          user_id: userId,
          post_id: postId,
        });
        return { success: true, bookmarked: true };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bookmark update failed.";
      return { success: false, bookmarked: false, error: message };
    }
  }

  /**
   * Add a comment to a post
   */
  static async addComment(
    userId: string,
    postId: string,
    content: string,
    parentCommentId?: string
  ): Promise<{ success: boolean; data?: Comment; error?: string }> {
    if (!content.trim()) {
      return { success: false, error: "Comment cannot be empty." };
    }

    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return { success: false, error: "Database not configured." };

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          user_id: userId,
          post_id: postId,
          content: content.trim(),
          parent_comment_id: parentCommentId || null,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add comment.";
      return { success: false, error: message };
    }
  }

  /**
   * Get comments for a post
   */
  static async getComments(postId: string): Promise<EnrichedComment[]> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return [];

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*, author:profiles!comments_user_id_fkey(*)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return [];
      }

      return (data as unknown as EnrichedComment[]) || [];
    } catch {
      return [];
    }
  }
}

