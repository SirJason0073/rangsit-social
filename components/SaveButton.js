'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Icon from './ui/Icon';
import { useToast } from './ui/Toast';

export default function SaveButton({ postId, initialSaved, disabled = false }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [saved, setSaved] = useState(!!initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSaved() {
    if (!user) {
      router.push('/login');
      return;
    }

    if (loading || disabled) return;
    const previousSaved = saved;
    const optimisticSaved = !saved;
    setSaved(optimisticSaved);
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error('Save failed');
      setSaved(Boolean(data.saved));
    } catch {
      setSaved(previousSaved);
      notify('Could not update the saved post.', { tone: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={loading || disabled}
      aria-pressed={saved}
      aria-busy={loading || undefined}
      aria-label={saved ? 'Remove post from saved items' : 'Save post'}
      className={`post-action inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-medium disabled:cursor-wait disabled:opacity-60 ${
        saved ? 'reaction-active text-brand-strong hover:bg-brand-subtle' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'
      }`}
    >
      <Icon name="bookmark" size="sm" className={saved ? 'fill-current' : ''} />
      <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
