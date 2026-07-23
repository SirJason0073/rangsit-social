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
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
        liked ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span>{liked ? '♥' : '♡'}</span>
      <span>{liked ? 'Liked' : 'Like'}</span>
      <span className="text-xs text-slate-400">{count}</span>
    </button>
  );
}
