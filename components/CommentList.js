'use client';

import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import { useAuth } from './Providers';
import { Card } from './ui/Card';
import { Skeleton, SkeletonText } from './ui/Skeleton';
import ErrorState from './ui/ErrorState';

export default function CommentList({ postId, initialComments }) {
  const { user } = useAuth();
  const hasInitialComments = Array.isArray(initialComments);
  const [comments, setComments] = useState(() => initialComments || []);
  const [loading, setLoading] = useState(!hasInitialComments);
  const [error, setError] = useState('');

  async function loadComments() {
    try {
      setError('');
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Comments failed');
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setError('Comments could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasInitialComments) return;
    loadComments();
  }, [hasInitialComments, postId]);

  async function handleAdd(content) {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Comment failed');
    const data = await res.json();
    setComments((current) => [
      ...current,
      {
        id: data.id,
        content,
        created_at: new Date().toISOString(),
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        user_avatar: user.avatar
      }
    ]);
  }

  return (
    <Card as="section" className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Comments</h3>
        <span className="badge" aria-label={`${comments.length} comments`}>{comments.length}</span>
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
      ) : error ? (
        <div className="mt-5"><ErrorState compact title="Unable to load comments" description={error} onRetry={() => { setLoading(true); loadComments(); }} /></div>
      ) : comments.length ? (
        <div className="mt-5 border-t border-border">
          {comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
        </div>
      ) : (
        <div className="mt-5 rounded-card bg-surface-muted p-5 text-center"><p className="text-sm font-medium text-foreground">No comments yet</p><p className="mt-1 text-xs text-foreground-muted">Start the conversation with a thoughtful reply.</p></div>
      )}
    </Card>
  );
}
