// ==============================================================================
// SWITCH SOCIAL PLATFORM - USER & PROFILE SERVER ACTIONS
// File: lib/actions/user.actions.ts
// Handles profile fetching, updates, avatar changes & follow toggling via Supabase
// ==============================================================================

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_SWITCH_POSTS } from "../data/worldsData";

const KNOWN_CREATORS: Record<string, any> = {
  "user-elena": {
    _id: "user-elena",
    id: "user-elena",
    username: "Elena_Vance",
    name: "Elena Vance",
    photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Head Baker & Pastry Designer. Obsessed with high hydration doughs, wild yeasts & Italian flour blends.",
    location: "Milan, Italy",
    website: "https://elenavance.kitchen",
    followers: ["user-maya", "user-sarah", "user-marco"],
    following: ["user-marco"],
    createdAt: "2024-03-15T00:00:00.000Z",
  },
  "user-maya": {
    _id: "user-maya",
    id: "user-maya",
    username: "Maya_Lin",
    name: "Maya Lin",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Contemporary oil painter capturing coastal mists, light refraction & atmospheric horizons.",
    location: "Stockholm, Sweden",
    website: "https://mayalin.art",
    followers: ["user-elena", "user-kenji", "user-jordan"],
    following: ["user-elena"],
    createdAt: "2024-01-20T00:00:00.000Z",
  },
  "user-sarah": {
    _id: "user-sarah",
    id: "user-sarah",
    username: "Sarah_Chen",
    name: "Sarah Chen",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Distributed systems architect. Core contributor to Tokio & lock-free Rust infrastructure.",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    followers: ["user-alex", "user-elena"],
    following: ["user-alex"],
    createdAt: "2023-11-05T00:00:00.000Z",
  },
  "user-jordan": {
    _id: "user-jordan",
    id: "user-jordan",
    username: "Jordan_Vance",
    name: "Jordan Vance",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Modular synth composer, tape loop experimenter, and sound designer for indie cinema.",
    location: "Berlin, Germany",
    website: "https://jordanvance.sound",
    followers: ["user-maya", "user-marcus"],
    following: ["user-maya"],
    createdAt: "2024-04-01T00:00:00.000Z",
  },
  "user-marcus": {
    _id: "user-marcus",
    id: "user-marcus",
    username: "Coach_Marcus",
    name: "Coach Marcus",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Gymnastic strength coach. Functional range conditioning and strict bodyweight control.",
    location: "Austin, TX",
    website: "https://coachmarcus.fit",
    followers: ["user-sarah", "user-jordan"],
    following: ["user-sarah"],
    createdAt: "2024-02-10T00:00:00.000Z",
  },
};

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient();

    // Query Supabase profiles table
    let profileQuery = supabase.from("profiles").select("*");

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (isUuid) {
      profileQuery = profileQuery.eq("id", userId);
    } else {
      profileQuery = profileQuery.ilike("username", userId);
    }

    const { data: profile, error } = await profileQuery.maybeSingle();

    if (profile && !error) {
      // Get follow counts
      const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profile.id),
        supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profile.id),
      ]);

      // Get user posts
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles!posts_user_id_fkey(*),
          world:worlds!posts_world_id_fkey(*),
          media:post_media(*)
        `)
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      const formattedThoughts = (posts || []).map((p: any) => ({
        _id: p.id,
        content: p.content,
        world: p.world?.name || "General",
        author: {
          _id: p.author?.id || profile.id,
          username: p.author?.username || profile.username,
          photo: p.author?.avatar_url || profile.avatar_url,
          bio: p.author?.bio || profile.bio,
        },
        image: p.media?.[0]?.media_url || null,
        likes: [],
        comments: [],
        createdAt: p.created_at,
      }));

      return {
        user: {
          _id: profile.id,
          id: profile.id,
          username: profile.username,
          name: profile.display_name || profile.username,
          photo: profile.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.id}`,
          bio: profile.bio || "",
          location: "Switch World",
          website: "",
          followers: new Array(followersCount || 0).fill("f"),
          following: new Array(followingCount || 0).fill("f"),
          createdAt: profile.created_at,
        },
        thoughts: formattedThoughts,
      };
    }
  } catch (error) {
    console.warn("Supabase query in getUserProfile fell back to local cache:", error);
  }

  // Fallback to known creator or generated profile
  const creator = KNOWN_CREATORS[userId] || {
    _id: userId || "user-current",
    id: userId || "user-current",
    username: userId === "user-current" ? "SwitchExplorer" : `Creator_${userId.slice(0, 6)}`,
    name: userId === "user-current" ? "Switch Explorer" : `Creator ${userId.slice(0, 6)}`,
    photo: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId || "SwitchUser"}`,
    bio: "Exploring the intersections of culture, engineering, and craftsmanship on Switch.",
    location: "Earth",
    website: "https://switch.social",
    followers: ["user-elena", "user-sarah"],
    following: ["user-maya"],
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  const userThoughts = INITIAL_SWITCH_POSTS.filter(
    (p) => p.author._id === userId || p.author.username === creator.username
  );

  return {
    user: creator,
    thoughts: userThoughts,
  };
}

export async function updateUserProfilePhoto(userId: string, photoUrl: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: photoUrl, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.warn("Supabase avatar update warning:", error);
    }

    revalidatePath("/profile");
    revalidatePath("/");
    return true;
  } catch (error) {
    console.warn("updateUserProfilePhoto fallback:", error);
    if (KNOWN_CREATORS[userId]) {
      KNOWN_CREATORS[userId].photo = photoUrl;
    }
    return true;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: {
    username?: string;
    display_name?: string;
    bio?: string;
    location?: string;
    website?: string;
  }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: updates.username?.trim(),
        display_name: updates.display_name?.trim() || updates.username?.trim(),
        bio: updates.bio?.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (!error && data) {
      revalidatePath("/profile");
      return data;
    }
  } catch (error) {
    console.warn("updateUserProfile fallback:", error);
  }

  if (KNOWN_CREATORS[userId]) {
    Object.assign(KNOWN_CREATORS[userId], updates);
    return KNOWN_CREATORS[userId];
  }
  return { _id: userId, ...updates };
}

export async function toggleFollowUser(currentUserId: string, targetUserId: string) {
  try {
    const supabase = await createClient();

    // Check existing follow
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUserId)
      .eq("following_id", targetUserId)
      .maybeSingle();

    let following = false;
    if (existing) {
      await supabase.from("follows").delete().eq("id", existing.id);
      following = false;
    } else {
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: targetUserId,
      });
      following = true;
    }

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", targetUserId);

    revalidatePath(`/profile/${targetUserId}`);
    return { following, count: count || (following ? 1 : 0) };
  } catch (e) {
    console.warn("toggleFollowUser fallback:", e);
  }

  const target = KNOWN_CREATORS[targetUserId];
  if (target) {
    const isFollowing = target.followers.includes(currentUserId);
    if (isFollowing) {
      target.followers = target.followers.filter((id: string) => id !== currentUserId);
    } else {
      target.followers.push(currentUserId);
    }
    return { following: !isFollowing, count: target.followers.length };
  }

  return { following: true, count: 1 };
}
