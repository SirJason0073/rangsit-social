'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PostCard from './PostCard';
import Loading from './Loading';
import EmptyState from './EmptyState';
import Button from './ui/Button';
import { Card } from './ui/Card';

export default function FeedList({
  endpoint,
  filterUserId,
  emptyTitle = 'No posts yet',
  emptyDescription = 'Be the first to share something with your community.'
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const resolvedEndpoint = endpoint || (filterUserId ? `/api/users/${filterUserId}` : '/api/posts');

  async function loadPosts(nextPage = 1, append = false) {
    const res = await fetch(`${resolvedEndpoint}?page=${nextPage}&limit=5`);
    const data = await res.json();
    setPosts((prev) => (append ? [...prev, ...(data.posts || [])] : (data.posts || [])));
    setHasMore(!!data.pagination?.hasMore);
    setPage(nextPage);
    setLoading(false);
    setLoadingMore(false);
  }

  useEffect(() => {
    setLoading(true);
    loadPosts(1, false);
  }, [resolvedEndpoint]);

  function handleDeleted(id) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    await loadPosts(page + 1, true);
  }

  if (loading) return <Loading label="Loading posts..." />;

  if (!posts.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link href="/posts/new">
            <Button>Create post</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {!filterUserId ? (
        <Card className="p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Start a post</p>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                Share a campus update, photo, or short video with your network.
              </p>
            </div>
            <Link href="/posts/new" className="md:shrink-0">
              <Button className="w-full md:w-auto">Create post</Button>
            </Link>
          </div>
        </Card>
      ) : null}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDeleted={handleDeleted} />
      ))}
      {hasMore ? (
        <div className="flex justify-center pt-2">
          <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline">
            {loadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
