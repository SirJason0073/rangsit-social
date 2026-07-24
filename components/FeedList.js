'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PostCard from './PostCard';
import InlineComposer from './InlineComposer';
import FeedSkeleton from './FeedSkeleton';
import EmptyState from './EmptyState';
import Button from './ui/Button';
import ErrorState from './ui/ErrorState';

export default function FeedList({
  endpoint,
  filterUserId,
  initialPosts,
  initialPagination,
  emptyTitle = 'No posts yet',
  emptyDescription = 'When someone publishes a post, it will appear here.'
}) {
  const hasInitialData = Array.isArray(initialPosts);
  const [posts, setPosts] = useState(() => initialPosts || []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(() => Number(initialPagination?.page) || 1);
  const [total, setTotal] = useState(() => Number(initialPagination?.total) || 0);
  const [hasMore, setHasMore] = useState(() => Boolean(initialPagination?.hasMore));
  const [error, setError] = useState('');
  const loadMoreRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const resolvedEndpoint = endpoint || (filterUserId ? `/api/users/${filterUserId}` : '/api/posts');
  const showComposer = !endpoint && !filterUserId;

  const loadPosts = useCallback(async (nextPage = 1, append = false) => {
    if (append && loadingMoreRef.current) return;
    if (append) {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }

    try {
      setError('');
      const separator = resolvedEndpoint.includes('?') ? '&' : '?';
      const response = await fetch(`${resolvedEndpoint}${separator}page=${nextPage}&limit=6`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Posts could not be loaded.');

      setPosts((current) => {
        if (!append) return data.posts || [];
        const existingIds = new Set(current.map((post) => String(post.id)));
        return [...current, ...(data.posts || []).filter((post) => !existingIds.has(String(post.id)))];
      });
      setHasMore(Boolean(data.pagination?.hasMore));
      setTotal(Number(data.pagination?.total) || 0);
      setPage(nextPage);
    } catch (requestError) {
      setError(requestError.message || 'Check your connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [resolvedEndpoint]);

  useEffect(() => {
    if (hasInitialData) return;
    setLoading(true);
    setPosts([]);
    setPage(1);
    loadPosts(1, false);
  }, [hasInitialData, loadPosts]);

  useEffect(() => {
    if (!hasInitialData) return;
    setPosts(initialPosts);
    setPage(Number(initialPagination?.page) || 1);
    setTotal(Number(initialPagination?.total) || 0);
    setHasMore(Boolean(initialPagination?.hasMore));
    setLoading(false);
  }, [hasInitialData, initialPagination, initialPosts]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMoreRef.current) {
          loadPosts(page + 1, true);
        }
      },
      { rootMargin: '320px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadPosts, page]);

  const addOptimistic = useCallback((post) => {
    setPosts((current) => [post, ...current]);
  }, []);

  const confirmOptimistic = useCallback((temporaryId, persisted) => {
    setPosts((current) => current.map((post) => (
      post.id === temporaryId
        ? { ...post, ...persisted, pending: false }
        : post
    )));
  }, []);

  const rollbackOptimistic = useCallback((temporaryId) => {
    setPosts((current) => current.filter((post) => post.id !== temporaryId));
  }, []);

  const handleDeleted = useCallback((id) => {
    setPosts((current) => current.filter((post) => String(post.id) !== String(id)));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {showComposer ? (
          <InlineComposer
            onOptimisticAdd={addOptimistic}
            onOptimisticConfirm={confirmOptimistic}
            onOptimisticRollback={rollbackOptimistic}
          />
        ) : null}
        <FeedSkeleton />
      </div>
    );
  }

  if (error && !posts.length) {
    return (
      <div className="space-y-4">
        {showComposer ? (
          <InlineComposer
            onOptimisticAdd={addOptimistic}
            onOptimisticConfirm={confirmOptimistic}
            onOptimisticRollback={rollbackOptimistic}
          />
        ) : null}
        <ErrorState title="Unable to load the feed" description={error} onRetry={() => { setLoading(true); loadPosts(1, false); }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showComposer ? (
        <InlineComposer
          onOptimisticAdd={addOptimistic}
          onOptimisticConfirm={confirmOptimistic}
          onOptimisticRollback={rollbackOptimistic}
        />
      ) : null}

      {!posts.length ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={<Link href="/posts/new" className="btn btn-primary">Create a post</Link>}
        />
      ) : (
        <div className="space-y-4" aria-live="polite" aria-label="Campus posts">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="feed-item"
              style={{ '--feed-index': Math.min(index, 5) }}
            >
              <PostCard post={post} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}

      {error && posts.length ? (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-card border border-danger/30 bg-danger-subtle p-4 text-sm text-danger" role="alert">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => loadPosts(page + 1, true)}>Retry</Button>
        </div>
      ) : null}

      {hasMore ? (
        <div ref={loadMoreRef} className="flex flex-col items-center gap-2 py-3">
          <Button onClick={() => loadPosts(page + 1, true)} loading={loadingMore} loadingLabel="Loading posts" variant="outline">
            Load more
          </Button>
          <p className="text-xs text-foreground-muted" aria-live="polite">
            Page {page} · {posts.filter((post) => !post.pending).length} of {total} posts loaded
          </p>
        </div>
      ) : posts.length ? (
        <p className="py-4 text-center text-xs text-foreground-muted">You’re all caught up.</p>
      ) : null}
    </div>
  );
}
