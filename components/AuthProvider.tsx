// ==============================================================================
// SWITCH SOCIAL PLATFORM - AUTH PROVIDER & CONTEXT
// File: components/AuthProvider.tsx
// Seamless Supabase Authentication Provider for Next.js App Router
// ==============================================================================

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getBrowserClient, getSupabaseBrowserConfig } from "@/lib/supabase/client";
import { AuthService } from "@/lib/services/auth.service";
import type { Profile } from "@/types/database";
import type { User, Session } from "@supabase/supabase-js";

export interface SwitchAuthSession {
  user: {
    id: string;
    _id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    photo: string;
    bio?: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: SwitchAuthSession | null;
  supabaseSession: Session | null;
  isLoading: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  supabaseSession: null,
  isLoading: true,
  status: "loading",
  signOut: async () => {},
  refreshProfile: async () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const p = await AuthService.getCurrentProfile();
      if (p) {
        setProfile(p);
      } else {
        // Fallback profile if row is still generating via trigger
        setProfile({
          id: currentUser.id,
          username:
            currentUser.user_metadata?.username ||
            currentUser.email?.split("@")[0] ||
            "user",
          display_name:
            currentUser.user_metadata?.display_name ||
            currentUser.user_metadata?.name ||
            null,
          bio: "",
          avatar_url:
            currentUser.user_metadata?.avatar_url ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.id}`,
          created_at: currentUser.created_at,
          updated_at: currentUser.created_at,
        });
      }
    } catch {
      // Ignore background fetch failure
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const { isConfigured } = getSupabaseBrowserConfig();
    if (!isConfigured) {
      // Demo / Mock Mode for preview before Supabase credentials are provided
      setIsLoading(false);
      return;
    }

    const supabase = getBrowserClient();

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Real-time Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSupabaseSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
    setProfile(null);
    setSupabaseSession(null);
    window.location.href = "/login";
  }, []);

  // Construct backward-compatible session object for existing components
  const activeSession: SwitchAuthSession | null = user
    ? {
        user: {
          id: user.id,
          _id: user.id,
          name: profile?.display_name || profile?.username || user.email?.split("@")[0] || "Switch Member",
          username: profile?.username || user.user_metadata?.username || user.email?.split("@")[0] || "user",
          email: user.email || "",
          image: profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
          photo: profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
          bio: profile?.bio || "",
        },
      }
    : null;

  const status = isLoading
    ? "loading"
    : user
    ? "authenticated"
    : "unauthenticated";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session: activeSession,
        supabaseSession,
        isLoading,
        status,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Backward-compatible hook replicating next-auth useSession() interface
export function useSession() {
  const { session, status } = useAuth();
  return { data: session, status };
}
