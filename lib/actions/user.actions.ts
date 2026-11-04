"use server";

import { connectToDatabase } from "../database";
import User from "../database/models/User";
import Thought from "../database/models/Thought";
import { revalidatePath } from "next/cache";
import { INITIAL_SWITCH_POSTS } from "../data/worldsData";

const KNOWN_CREATORS: Record<string, any> = {
  "user-elena": {
    _id: "user-elena",
    username: "Elena_Vance",
    photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Head Baker & Pastry Designer. Obsessed with high hydration doughs, wild yeasts & Italian flour blends.",
    location: "Milan, Italy",
    website: "https://elenavance.kitchen",
    followers: ["user-maya", "user-sarah", "user-marco"],
    following: ["user-marco"],
    createdAt: "2024-03-15T00:00:00.000Z"
  },
  "user-maya": {
    _id: "user-maya",
    username: "Maya_Lin",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Contemporary oil painter capturing coastal mists, light refraction & atmospheric horizons.",
    location: "Stockholm, Sweden",
    website: "https://mayalin.art",
    followers: ["user-elena", "user-kenji", "user-jordan"],
    following: ["user-elena"],
    createdAt: "2024-01-20T00:00:00.000Z"
  },
  "user-sarah": {
    _id: "user-sarah",
    username: "Sarah_Chen",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Distributed systems architect. Core contributor to Tokio & lock-free Rust infrastructure.",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    followers: ["user-alex", "user-elena"],
    following: ["user-alex"],
    createdAt: "2023-11-05T00:00:00.000Z"
  },
  "user-jordan": {
    _id: "user-jordan",
    username: "Jordan_Vance",
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Modular synth composer, tape loop experimenter, and sound designer for indie cinema.",
    location: "Berlin, Germany",
    website: "https://jordanvance.sound",
    followers: ["user-maya", "user-marcus"],
    following: ["user-maya"],
    createdAt: "2024-04-01T00:00:00.000Z"
  },
  "user-marcus": {
    _id: "user-marcus",
    username: "Coach_Marcus",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Gymnastic strength coach. Functional range conditioning and strict bodyweight control.",
    location: "Austin, TX",
    website: "https://coachmarcus.fit",
    followers: ["user-sarah", "user-jordan"],
    following: ["user-sarah"],
    createdAt: "2024-02-10T00:00:00.000Z"
  }
};

export async function getUserProfile(userId: string) {
  try {
    await connectToDatabase();
    
    // We lean() to get plain JSON objects, removing Mongoose metadata
    const user = await User.findById(userId).lean();
    if (user) {
      const thoughts = await Thought.find({ author: userId })
        .populate({ path: "author", model: User, select: "_id username photo bio" })
        .populate({ path: "comments.author", model: User, select: "_id username photo" })
        .sort({ createdAt: "desc" })
        .lean();
        
      return {
        user: JSON.parse(JSON.stringify(user)),
        thoughts: JSON.parse(JSON.stringify(thoughts))
      };
    }
  } catch (error) {
    console.warn("MongoDB unavailable in getUserProfile, checking fallback data:", error);
  }

  // Fallback to known creator or generated profile
  const creator = KNOWN_CREATORS[userId] || {
    _id: userId || "user-current",
    username: userId === "user-current" ? "SwitchExplorer" : `Creator_${userId.slice(0, 6)}`,
    photo: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId || 'SwitchUser'}`,
    bio: "Exploring the intersections of culture, engineering, and craftsmanship on Switch.",
    location: "Earth",
    website: "https://switch.social",
    followers: ["user-elena", "user-sarah"],
    following: ["user-maya"],
    createdAt: "2024-01-01T00:00:00.000Z"
  };

  const userThoughts = INITIAL_SWITCH_POSTS.filter(p => p.author._id === userId || p.author.username === creator.username);

  return {
    user: creator,
    thoughts: userThoughts
  };
}

export async function updateUserProfilePhoto(userId: string, photoBase64: string) {
  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { photo: photoBase64 });
    revalidatePath("/profile");
    revalidatePath("/");
    return true;
  } catch (error) {
    console.warn("DB offline in updateUserProfilePhoto:", error);
    if (KNOWN_CREATORS[userId]) {
      KNOWN_CREATORS[userId].photo = photoBase64;
    }
    return true;
  }
}

export async function updateUserProfile(userId: string, updates: {
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
}) {
  try {
    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
    revalidatePath("/profile");
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.warn("DB offline in updateUserProfile, updated in memory:", error);
    if (KNOWN_CREATORS[userId]) {
      Object.assign(KNOWN_CREATORS[userId], updates);
      return KNOWN_CREATORS[userId];
    }
    return { _id: userId, ...updates };
  }
}

export async function toggleFollowUser(currentUserId: string, targetUserId: string) {
  try {
    await connectToDatabase();
    const target = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (target && currentUser) {
      const isFollowing = target.followers.includes(currentUserId);
      if (isFollowing) {
        target.followers = target.followers.filter((id: any) => id.toString() !== currentUserId);
        currentUser.following = currentUser.following.filter((id: any) => id.toString() !== targetUserId);
      } else {
        target.followers.push(currentUserId);
        currentUser.following.push(targetUserId);
      }
      await target.save();
      await currentUser.save();
      revalidatePath(`/profile/${targetUserId}`);
      return { following: !isFollowing, count: target.followers.length };
    }
  } catch (e) {
    console.warn("toggleFollowUser DB offline:", e);
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
