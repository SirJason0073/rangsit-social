'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import ErrorState from './ui/ErrorState';
import Icon from './ui/Icon';
import { Skeleton } from './ui/Skeleton';

const Dialog = dynamic(() => import('./ui/Dialog'), { ssr: false });

export default function ProfileMediaGrid({ userId, initialPosts, initialPagination }) {
  const hasInitialData = Array.isArray(initialPosts);
  const [mediaPosts, setMediaPosts] = useState(() => (initialPosts || []).filter((post) => post.media_url));
  const [page, setPage] = useState(() => Number(initialPagination?.page) || 1);
  const [hasMore, setHasMore] = useState(() => Boolean(initialPagination?.hasMore));
  const [loading, setLoading] = useState(!hasInitialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [activePost, setActivePost] = useState(null);

  const loadMedia = useCallback(async (nextPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    try {
      setError('');
      const response = await fetch(`/api/users/${userId}?page=${nextPage}&limit=12`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Media could not be loaded.');
      const nextMedia = (data.posts || []).filter((post) => post.media_url);
      setMediaPosts((current) => append ? [...current, ...nextMedia] : nextMedia);
      setHasMore(Boolean(data.pagination?.hasMore));
      setPage(nextPage);
    } catch (requestError) {
      setError(requestError.message || 'Media could not be loaded.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  useEffect(() => {
    if (hasInitialData) return;
    setLoading(true);
    loadMedia(1, false);
  }, [hasInitialData, loadMedia]);

  useEffect(() => {
    if (!hasInitialData) return;
    setMediaPosts(initialPosts.filter((post) => post.media_url));
    setPage(Number(initialPagination?.page) || 1);
    setHasMore(Boolean(initialPagination?.hasMore));
    setLoading(false);
  }, [hasInitialData, initialPagination, initialPosts]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Loading profile media">
        {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="aspect-square rounded-card" />)}
      </div>
    );
  }

  if (error && !mediaPosts.length) {
    return <ErrorState title="Unable to load media" description={error} onRetry={() => { setLoading(true); loadMedia(1, false); }} />;
  }

  if (!mediaPosts.length && !hasMore) {
    return <EmptyState icon={<Icon name="image" />} title="No media yet" description="Photos and videos from this profile will appear here." />;
  }

  return (
    <div className="space-y-4">
      {mediaPosts.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {mediaPosts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setActivePost(post)}
              className="group relative aspect-square overflow-hidden rounded-card border border-border bg-surface-muted"
              aria-label={`Open ${post.media_type === 'video' ? 'video' : 'photo'} from post`}
            >
              {post.media_type === 'video' ? (
                <>
                  <video src={post.media_url} className="media-image h-full w-full object-cover" muted preload="metadata" />
                  <span className="absolute inset-0 flex items-center justify-center bg-surface-inverse/15">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-elevated/90 text-foreground shadow-2"><Icon name="play" /></span>
                  </span>
                </>
              ) : (
                <Image src={post.media_url} alt="" fill sizes="(max-width: 640px) 50vw, 260px" className="media-image object-cover transition duration-normal group-hover:brightness-90" />
              )}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p role="alert" className="text-center text-sm text-danger">{error}</p> : null}
      {hasMore ? (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => loadMedia(page + 1, true)} loading={loadingMore} loadingLabel="Loading media">Load more media</Button>
        </div>
      ) : null}

      {activePost ? (
        <Dialog
          open
          onOpenChange={(open) => { if (!open) setActivePost(null); }}
          title="Profile media"
          description={activePost.content || 'Media shared in a campus post.'}
          size="lg"
          footer={<Link href={`/posts/${activePost.id}`} className="btn btn-primary">Open full post</Link>}
        >
          {activePost.media_type === 'video' ? (
            <video src={activePost.media_url} className="max-h-[70dvh] w-full rounded-card bg-surface-inverse" controls autoPlay preload="metadata" />
          ) : (
            <Image
              src={activePost.media_url}
              alt="Expanded profile media"
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 100vw, 960px"
              className="max-h-[70dvh] w-full rounded-card bg-surface-inverse object-contain"
            />
          )}
        </Dialog>
      ) : null}
    </div>
  );
}
