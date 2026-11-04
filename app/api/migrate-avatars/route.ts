import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    const oldUsers = await User.find({
      $or: [
        { photo: "/userr.jpg" },
        { photo: { $regex: "ui-avatars.com" } },
        { photo: { $exists: false } }
      ]
    });

    for (const user of oldUsers) {
      user.photo = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username || 'User'}`;
      await user.save();
    }

    return NextResponse.json({ message: 'Migration successful', updated: oldUsers.length });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Failed to migrate' }, { status: 500 });
  }
}
