'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

export default function FollowButton({ targetId, initialFollowing, onChange, size = 'md' }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollowing(Boolean(initialFollowing));
  }, [initialFollowing]);

  async function toggleFollow() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (loading) return;
    const previousFollowing = following;
    const optimisticFollowing = !following;
    setFollowing(optimisticFollowing);
    onChange?.(optimisticFollowing);
    setLoading(true);
    try {
      const res = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetId })
      });
      if (!res.ok) throw new Error('Follow failed');
      const data = await res.json();
      if (Boolean(data.following) !== optimisticFollowing) {
        setFollowing(Boolean(data.following));
        onChange?.(Boolean(data.following));
      }
    } catch {
      setFollowing(previousFollowing);
      onChange?.(previousFollowing);
      notify('Could not update this follow.', { tone: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  if (Number(user?.id) === Number(targetId)) return null;

  return (
    <Button type="button" onClick={toggleFollow} loading={loading} loadingLabel="Updating" aria-pressed={following} variant={following ? 'outline' : 'primary'} size={size}>
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
