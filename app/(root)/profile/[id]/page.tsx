import React from 'react';
import Profile from '@/components/ui/Profile';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <Profile userId={id} />
    </div>
  );
}
