'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import { formatDate } from '@/utils/format';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import { Card } from './ui/Card';

function displayName(post) {
  const full = [post.first_name, post.last_name].filter(Boolean).join(' ');
  return full || post.username || 'User';
}

export default function PostCard({ post, onDeleted, showActions = true }) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm('Delete this post?');
    if (!ok) return;
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
    if (res.ok) {
      onDeleted?.(post.id);
      router.push('/feed');
    }
  }

  return (
    <Card as="article" className="overflow-hidden p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {post.author_avatar ? (
            <Image
              src={post.author_avatar}
              alt={displayName(post)}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {displayName(post).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <Link href={`/profile/${post.user_id}`} className="truncate font-semibold text-foreground hover:text-brand-700">
              {displayName(post)}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground-muted">
              <span>{formatDate(post.created_at)}</span>
              {post.media_type ? <span className="hidden md:inline">•</span> : null}
              {post.media_type ? <span>{post.media_type === 'video' ? 'Video post' : 'Image post'}</span> : null}
            </div>
          </div>
        </div>
        <Link href={`/posts/${post.id}`} className="hidden text-sm font-medium text-foreground-muted transition hover:text-brand-700 md:inline">
          View post
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs font-medium">
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-brand-700">
          {post.like_count || 0} likes
        </span>
        <span className="inline-flex rounded-full bg-surface-muted px-3 py-1 text-foreground-muted">
          {post.comment_count || 0} comments
        </span>
      </div>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-foreground-secondary">{post.content}</p>

      {post.media_url && post.media_type === 'image' && (
        <div className="mt-5 overflow-hidden rounded-panel border border-border bg-surface-muted">
          <Image
            src={post.media_url}
            alt="Post media"
            width={1200}
            height={900}
            className="max-h-[30rem] w-full object-cover"
          />
        </div>
      )}

      {post.media_url && post.media_type === 'video' && (
        <div className="mt-5 overflow-hidden rounded-panel border border-border bg-surface-inverse">
          <video
            src={post.media_url}
            className="max-h-[30rem] w-full"
            controls
          />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
          <LikeButton postId={post.id} initialLiked={!!post.liked} initialCount={post.like_count} />
          <Link
            href={`/posts/${post.id}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-surface-muted hover:text-brand-700"
          >
            <span>Comment</span>
            <span className="text-xs text-foreground-muted">{post.comment_count}</span>
          </Link>
          <SaveButton postId={post.id} initialSaved={!!post.saved} />
        </div>

        {showActions && user?.id === post.user_id && (
          <div className="flex items-center gap-3 text-sm">
            <Link href={`/posts/${post.id}/edit`} className="font-medium text-foreground-muted hover:text-brand-700">Edit</Link>
            <button onClick={handleDelete} className="text-danger hover:text-danger">Delete</button>
          </div>
        )}
      </div>
    </Card>
  );
}
