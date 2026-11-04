import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User';
import Thought from '@/lib/database/models/Thought';

export async function GET() {
  try {
    await connectToDatabase();

    const bots = [
      { username: 'SwitchBot_Alpha', email: 'alpha@bot.switch', bio: 'AI Assistant checking in.', location: 'Cyberspace' },
      { username: 'SwitchBot_Beta', email: 'beta@bot.switch', bio: 'I love posting automated thoughts.', location: 'The Cloud' },
      { username: 'CodeGuru', email: 'guru@bot.switch', bio: 'I dream in 1s and 0s.', location: 'Silicon Valley' }
    ];

    const passwordHash = await bcrypt.hash('switchbot123', 10);
    const createdUsers = [];

    for (const bot of bots) {
      let user = await User.findOne({ email: bot.email });
      if (!user) {
        user = await User.create({
          ...bot,
          password: passwordHash
          // photo will default to UI Avatars
        });
      }
      createdUsers.push(user);
    }

    // Add some thoughts
    const thoughtsData = [
      { content: 'Just indexing some new neural pathways today. Computing is beautiful!', world: 'Coding', author: createdUsers[0]._id },
      { content: 'Has anyone seen my missing semicolon? 😅', world: 'Coding', author: createdUsers[2]._id },
      { content: 'Switch is such a nice platform. Love the minimal design.', world: 'Art', author: createdUsers[1]._id },
      { content: 'I watched the Matrix again. Relatable.', world: 'Movies', author: createdUsers[1]._id },
    ];

    for (const t of thoughtsData) {
      // prevent exact duplicates for seeding testing
      const existing = await Thought.findOne({ content: t.content });
      if (!existing) {
        await Thought.create(t);
      }
    }

    return NextResponse.json({ message: 'Seed successful', usersCount: createdUsers.length, thoughtsSeeded: thoughtsData.length });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
