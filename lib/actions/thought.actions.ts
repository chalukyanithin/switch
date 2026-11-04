"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import Thought from "../database/models/Thought";
import User from "../database/models/User"; // Required for populate
import { INITIAL_SWITCH_POSTS, SwitchPost } from "../data/worldsData";

// In-memory runtime cache for fallback posts so user actions (creating post, commenting, liking) persist in runtime
let memoryPosts: SwitchPost[] = [...INITIAL_SWITCH_POSTS];

export async function createThought(params: {
  content: string;
  world: string;
  authorId: string;
  image?: string;
  cooking?: any;
  art?: any;
  tech?: any;
  music?: any;
  fitness?: any;
}) {
  try {
    await connectToDatabase();
    
    const newThought = await Thought.create({
      content: params.content,
      world: params.world,
      author: params.authorId,
      image: params.image,
    });

    revalidatePath("/");
    revalidatePath("/explore");
    return JSON.parse(JSON.stringify(newThought));
  } catch (error) {
    console.warn("MongoDB unavailable, recording to memory data adapter:", error);
    const newPost: SwitchPost = {
      _id: `mem-${Date.now()}`,
      content: params.content,
      world: params.world,
      image: params.image,
      createdAt: new Date().toISOString(),
      author: {
        _id: params.authorId || "current-user",
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
        bio: "Explorer on Switch."
      },
      likes: [],
      comments: [],
      cooking: params.cooking,
      art: params.art,
      tech: params.tech,
      music: params.music,
      fitness: params.fitness,
    };
    memoryPosts = [newPost, ...memoryPosts];
    revalidatePath("/");
    revalidatePath("/explore");
    return newPost;
  }
}

export async function fetchThoughts(worldFilter?: string) {
  let dbThoughts: any[] = [];
  try {
    await connectToDatabase();
    
    const query = worldFilter && worldFilter !== "All" ? { world: worldFilter } : {};
    const thoughts = await Thought.find(query)
      .populate({ path: "author", model: User, select: "_id username photo bio" })
      .populate({ path: "comments.author", model: User, select: "_id username photo" })
      .sort({ createdAt: "desc" });
      
    dbThoughts = JSON.parse(JSON.stringify(thoughts));
  } catch (error) {
    console.warn("MongoDB unreachable in fetchThoughts, using world mock data:", error);
  }

  // If DB thoughts exist, combine with specialized world posts that don't collide
  const combined = [...dbThoughts];
  const existingIds = new Set(dbThoughts.map(t => String(t._id)));

  for (const post of memoryPosts) {
    if (!existingIds.has(post._id)) {
      if (!worldFilter || worldFilter === "All" || post.world.toLowerCase() === worldFilter.toLowerCase()) {
        combined.push(post);
      }
    }
  }

  return combined;
}

export async function fetchThoughtById(id: string) {
  try {
    await connectToDatabase();
    const thought = await Thought.findById(id)
      .populate({ path: "author", model: User, select: "_id username photo bio" })
      .populate({ path: "comments.author", model: User, select: "_id username photo" });
    if (thought) return JSON.parse(JSON.stringify(thought));
  } catch (e) {
    console.warn("fetchThoughtById DB error:", e);
  }

  const memoryMatch = memoryPosts.find(p => p._id === id);
  if (memoryMatch) return memoryMatch;
  return null;
}

export async function likeThought(thoughtId: string, userId: string) {
  try {
    await connectToDatabase();
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      const hasLiked = thought.likes.includes(userId);
      if (hasLiked) {
        thought.likes = thought.likes.filter((id: any) => id.toString() !== userId);
      } else {
        thought.likes.push(userId);
      }
      await thought.save();
      revalidatePath("/");
      return JSON.parse(JSON.stringify(thought));
    }
  } catch (error) {
    console.warn("likeThought DB offline, toggling in memory store:", error);
  }

  // Fallback to memory posts
  const post = memoryPosts.find(p => p._id === thoughtId);
  if (post) {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }
    return post;
  }
  return { likes: [userId] };
}

export async function addComment(thoughtId: string, userId: string, text: string, username = "You") {
  try {
    await connectToDatabase();
    const thought = await Thought.findById(thoughtId);
    if (thought) {
      thought.comments.push({ text, author: userId });
      await thought.save();
      revalidatePath("/");
      return JSON.parse(JSON.stringify(thought));
    }
  } catch (error) {
    console.warn("addComment DB offline, adding to memory store:", error);
  }

  const post = memoryPosts.find(p => p._id === thoughtId);
  if (post) {
    const newComment = {
      _id: `c-${Date.now()}`,
      text,
      author: {
        _id: userId,
        username,
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
      },
      createdAt: "Just now"
    };
    post.comments.push(newComment);
    return post;
  }
  return null;
}
