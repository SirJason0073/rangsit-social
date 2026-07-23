'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';

export default function SaveButton({ postId, initialSaved }) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(!!initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSaved() {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setSaved(!!data.saved);
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
        saved ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
