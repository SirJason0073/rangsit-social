'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';

export default function LikeButton({ postId, initialLiked, initialCount }) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function toggleLike() {
    if (!user) {
      router.push('/login');
      return;
    }
    const res = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const nextLiked = data.liked;
      setLiked(nextLiked);
      setCount((prev) => (nextLiked ? prev + 1 : prev - 1));
    }
  }

  return (
    <button
      onClick={toggleLike}
      type="button"
      aria-pressed={liked}
      aria-label={`${liked ? 'Unlike' : 'Like'} post. ${count || 0} likes`}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
        liked ? 'bg-danger-subtle text-danger' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'
      }`}
    >
      <span>{liked ? '♥' : '♡'}</span>
      <span>{liked ? 'Liked' : 'Like'}</span>
      <span className="text-xs text-foreground-muted">{count}</span>
    </button>
  );
}
