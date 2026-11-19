// ==============================================================================
// SWITCH SOCIAL PLATFORM - PROFILE SERVICE
// File: lib/services/profile.service.ts
// Handles profile retrieval, updates, username verification & avatar uploads
// ==============================================================================

import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export interface UpdateProfileParams {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

export class ProfileService {
  /**
   * Get user profile by unique ID
   */
  static async getProfileById(userId: string): Promise<Profile | null> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return null;

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile by id:", error);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Get user profile by unique username
   */
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return null;

    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile by username:", error);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Check if a username is available
   */
  static async isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return true;

    const supabase = getBrowserClient();
    try {
      let query = supabase
        .from("profiles")
        .select("id")
        .ilike("username", username.trim());

      if (currentUserId) {
        query = query.neq("id", currentUserId);
      }

      const { data } = await query.maybeSingle();
      return !data;
    } catch {
      return true;
    }
  }

  /**
   * Update profile fields (display_name, bio, username)
   */
  static async updateProfile(
    userId: string,
    params: UpdateProfileParams
  ): Promise<{ success: boolean; data?: Profile; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return { success: false, error: "Database not configured." };
    }

    const supabase = getBrowserClient();

    // If username is changing, ensure uniqueness
    if (params.username) {
      const available = await this.isUsernameAvailable(params.username, userId);
      if (!available) {
        return { success: false, error: "This username is already taken." };
      }
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...params,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      return { success: false, error: message };
    }
  }

  /**
   * Upload avatar image to Supabase Storage ('avatars' bucket)
   * Validates file size (max 5MB) and mime type
   */
  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return { success: false, error: "Storage not configured." };
    }

    // 1. Validation
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return { success: false, error: "Avatar file size must be less than 5MB." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Supported avatar formats are JPG, PNG, WebP, and GIF." };
    }

    const supabase = getBrowserClient();
    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Automatically update profile record with new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl });

      return { success: true, url: publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar.";
      return { success: false, error: message };
    }
  }
}

