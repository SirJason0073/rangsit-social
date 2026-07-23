'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatDate } from '@/utils/format';
import CommentForm from './CommentForm';
import { useAuth } from './Providers';
import { Card } from './ui/Card';
import { Skeleton, SkeletonText } from './ui/Skeleton';

function displayName(comment) {
  const full = [comment.first_name, comment.last_name].filter(Boolean).join(' ');
  return full || comment.username || 'User';
}

export default function CommentList({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadComments() {
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function handleAdd(content) {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (res.ok) {
      loadComments();
    }
  }

  return (
    <Card as="section" className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Comments</h3>
        <span className="badge">{comments.length}</span>
      </div>

      {user ? (
        <CommentForm onSubmit={handleAdd} />
      ) : (
        <p className="mt-3 text-sm text-foreground-muted">Log in to join the conversation.</p>
      )}

      {loading ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-panel border border-border bg-surface-elevated/80 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            </div>
            <SkeletonText lines={2} className="mt-3" />
          </div>
        </div>
      ) : comments.length ? (
        <div className="mt-5 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-panel border border-border bg-surface-elevated/80 p-4">
              <div className="flex items-center gap-3">
                {comment.user_avatar ? (
                  <Image
                    src={comment.user_avatar}
                    alt={displayName(comment)}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                    {displayName(comment).slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{displayName(comment)}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">{formatDate(comment.created_at)}</p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground-secondary">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-foreground-muted">No comments yet. Be the first!</p>
      )}
    </Card>
  );
}
