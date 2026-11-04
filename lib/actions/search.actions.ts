"use server";

import { connectToDatabase } from "../database";
import User from "../database/models/User";
import Thought from "../database/models/Thought";
import { INITIAL_SWITCH_POSTS } from "../data/worldsData";

export async function globalSearch(query: string) {
  let users: any[] = [];
  let thoughts: any[] = [];

  const cleanQuery = query.trim().toLowerCase();

  try {
    await connectToDatabase();
    
    // Search users by username (case-insensitive regex)
    users = await User.find({ username: { $regex: cleanQuery, $options: "i" } })
      .select("_id username photo bio")
      .limit(5)
      .lean();
      
    // Search thoughts by content (case-insensitive regex)
    thoughts = await Thought.find({ content: { $regex: cleanQuery, $options: "i" } })
      .populate({ path: "author", model: User, select: "_id username photo" })
      .populate({ path: "comments.author", model: User, select: "_id username photo" })
      .sort({ createdAt: "desc" })
      .limit(20)
      .lean();
      
    users = JSON.parse(JSON.stringify(users));
    thoughts = JSON.parse(JSON.stringify(thoughts));
  } catch (error) {
    console.warn("DB offline during search, searching in-memory datasets:", error);
  }

  // Fallback / merge with rich sample data
  const fallbackThoughts = INITIAL_SWITCH_POSTS.filter(post => 
    post.content.toLowerCase().includes(cleanQuery) ||
    post.world.toLowerCase().includes(cleanQuery) ||
    post.author.username.toLowerCase().includes(cleanQuery) ||
    (post.cooking && post.cooking.ingredients.some(i => i.toLowerCase().includes(cleanQuery))) ||
    (post.tech && post.tech.techStack.some(s => s.toLowerCase().includes(cleanQuery))) ||
    (post.art && (post.art.medium.toLowerCase().includes(cleanQuery) || post.art.style.toLowerCase().includes(cleanQuery))) ||
    (post.music && (post.music.genre.toLowerCase().includes(cleanQuery) || post.music.trackTitle.toLowerCase().includes(cleanQuery)))
  );

  const fallbackUsers = [
    { _id: "user-elena", username: "Elena_Vance", photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80", bio: "Artisanal Baker & Culinary Explorer in Milan & Tokyo." },
    { _id: "user-maya", username: "Maya_Lin", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", bio: "Contemporary oil painter exploring light scattering & coastal mists." },
    { _id: "user-sarah", username: "Sarah_Chen", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80", bio: "Distributed systems architect. Core contributor to Tokio & Rust." },
    { _id: "user-jordan", username: "Jordan_Vance", photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80", bio: "Modular synthesist & film composer. Analog reel tape sessions." },
    { _id: "user-marcus", username: "Coach_Marcus", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80", bio: "Gymnastic strength coach & functional movement specialist." },
  ].filter(u => u.username.toLowerCase().includes(cleanQuery) || u.bio.toLowerCase().includes(cleanQuery));

  // Merge unique
  const userIds = new Set(users.map(u => String(u._id)));
  for (const u of fallbackUsers) {
    if (!userIds.has(u._id)) users.push(u);
  }

  const thoughtIds = new Set(thoughts.map(t => String(t._id)));
  for (const t of fallbackThoughts) {
    if (!thoughtIds.has(t._id)) thoughts.push(t);
  }

  return {
    users,
    thoughts
  };
}
