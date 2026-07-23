'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Button from './ui/Button';

export default function FollowButton({ targetId, initialFollowing, onChange }) {
  const { user } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/follows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: targetId })
    });
    if (res.ok) {
      const data = await res.json();
      setFollowing(data.following);
      onChange?.(data.following);
    }
    setLoading(false);
  }

  if (user?.id === Number(targetId)) return null;

  return (
    <Button type="button" onClick={toggleFollow} disabled={loading} aria-pressed={following} variant={following ? 'outline' : 'primary'}>
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
