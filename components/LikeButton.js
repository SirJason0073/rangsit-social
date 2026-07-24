'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Icon from './ui/Icon';
import { useToast } from './ui/Toast';

export default function LikeButton({ postId, initialLiked, initialCount, disabled = false }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(Number(initialCount) || 0);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!user) {
      router.push('/login');
      return;
    }
    if (loading || disabled) return;
    const previousLiked = liked;
    const previousCount = count;
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setCount(Math.max(0, count + (optimisticLiked ? 1 : -1)));
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' });
      if (!res.ok) throw new Error('Like failed');
      const data = await res.json();
      if (Boolean(data.liked) !== optimisticLiked) {
        setLiked(Boolean(data.liked));
        setCount(Math.max(0, previousCount + (data.liked ? 1 : -1)));
      }
    } catch {
      setLiked(previousLiked);
      setCount(previousCount);
      notify('Could not update this like.', { tone: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      type="button"
      aria-pressed={liked}
      aria-label={`${liked ? 'Unlike' : 'Like'} post. ${count} likes`}
      aria-busy={loading || undefined}
      disabled={loading || disabled}
      className={`post-action inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-medium disabled:cursor-wait disabled:opacity-60 ${
        liked ? 'reaction-active text-danger hover:bg-danger-subtle' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'
      }`}
    >
      <Icon name="heart" size="sm" className={liked ? 'fill-current' : ''} />
      <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
      <span>{count}</span>
    </button>
  );
}
