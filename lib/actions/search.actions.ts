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
    (post.tech && (post.tech.repoName.toLowerCase().includes(cleanQuery) || post.tech.techStack.some(s => s.toLowerCase().includes(cleanQuery)))) ||
    (post.meme && (post.meme.caption.toLowerCase().includes(cleanQuery) || post.meme.layers.some(l => l.text.toLowerCase().includes(cleanQuery)))) ||
    (post.cricket && (post.cricket.matchTitle.toLowerCase().includes(cleanQuery) || post.cricket.battingTeam.toLowerCase().includes(cleanQuery) || post.cricket.bowlingTeam.toLowerCase().includes(cleanQuery)))
  );

  const fallbackUsers = [
    { _id: "user-sarah", username: "Sarah_Chen", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80", bio: "Distributed systems architect. Tokio & Rust compiler contributor." },
    { _id: "user-doge", username: "DogeKing_420", photo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&h=300&q=80", bio: "Chief Meme Architect at Switch. Remixing reality since 2018." },
    { _id: "user-cricket", username: "CricketDaily_HQ", photo: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=300&h=300&q=80", bio: "Ball-by-ball coverage, Hawk-Eye analytics, and post-match dugout reactions." },
    { _id: "user-alex", username: "Alex_Rivera", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80", bio: "V8 internals explorer & high-throughput distributed actor systems." },
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
