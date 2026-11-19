// ==============================================================================
// SWITCH SOCIAL PLATFORM - AUTH SERVICE
// File: lib/services/auth.service.ts
// Handles user registration, credentials login, session verification & signout
// ==============================================================================

import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export interface SignUpParams {
  username: string;
  displayName?: string;
  email: string;
  password: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  needsEmailConfirmation?: boolean;
}

export class AuthService {
  /**
   * Validate password rules
   */
  static validatePassword(password: string): { valid: boolean; error?: string } {
    if (!password || password.length < 6) {
      return { valid: false, error: "Password must be at least 6 characters long." };
    }
    return { valid: true };
  }

  /**
   * Validate username rules (alphanumeric, underscore, period, 3-30 chars)
   */
  static validateUsername(username: string): { valid: boolean; error?: string } {
    if (!username || username.trim().length < 3) {
      return { valid: false, error: "Username must be at least 3 characters long." };
    }
    if (username.length > 30) {
      return { valid: false, error: "Username cannot exceed 30 characters." };
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
      return {
        valid: false,
        error: "Username may only contain letters, numbers, underscores, and periods.",
      };
    }
    return { valid: true };
  }

  /**
   * Register a new user with Supabase Auth & automatically seed profile
   */
  static async signUp(params: SignUpParams): Promise<AuthResponse> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return {
        success: false,
        error: "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
      };
    }

    const usernameValidation = this.validateUsername(params.username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }

    const passwordValidation = this.validatePassword(params.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    const supabase = getBrowserClient();
    const cleanUsername = params.username.trim();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanDisplay = (params.displayName || cleanUsername).trim();

    try {
      // 1. Check if username is already taken in profiles table
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.warn("Username availability check warning:", checkError);
      }

      if (existingUser) {
        return {
          success: false,
          error: `Username "@${cleanUsername}" is already taken. Please choose another.`,
        };
      }

      // 2. Sign up user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            username: cleanUsername,
            display_name: cleanDisplay,
            name: cleanDisplay,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      const user = data.user;
      const session = data.session;
      const needsEmailConfirmation = Boolean(user && !session);

      return {
        success: true,
        data: user,
        needsEmailConfirmation,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
      return { success: false, error: message };
    }
  }

  /**
   * Authenticate with email & password
   */
  static async signIn(params: SignInParams): Promise<AuthResponse> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return {
        success: false,
        error: "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
      };
    }

    const supabase = getBrowserClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim().toLowerCase(),
        password: params.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data.session };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in.";
      return { success: false, error: message };
    }
  }

  /**
   * Authenticate with Google OAuth
   */
  static async signInWithGoogle(redirectTo?: string): Promise<AuthResponse> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      return {
        success: false,
        error: "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
      };
    }

    const supabase = getBrowserClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const callbackUrl = redirectTo || `${origin}/api/auth/callback`;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initiate Google sign in.";
      return { success: false, error: message };
    }
  }

  /**
   * Terminate authenticated session
   */
  static async signOut(): Promise<AuthResponse> {
    const supabase = getBrowserClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign out.";
      return { success: false, error: message };
    }
  }

  /**
   * Retrieve current user profile
   */
  static async getCurrentProfile(): Promise<Profile | null> {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) return null;

    const supabase = getBrowserClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !data) {
        // Fallback to auth metadata if profile row is still syncing
        return {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split("@")[0] || "user",
          display_name: user.user_metadata?.display_name || user.user_metadata?.name || null,
          bio: "",
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: user.created_at,
          updated_at: user.created_at,
        };
      }

      return data;
    } catch {
      return null;
    }
  }
}

