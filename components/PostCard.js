'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import { formatDate } from '@/utils/format';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import PostMedia from './PostMedia';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Icon from './ui/Icon';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './ui/Dropdown';
import { useToast } from './ui/Toast';

const Dialog = dynamic(() => import('./ui/Dialog'), { ssr: false });

function displayName(post) {
  return [post.first_name, post.last_name].filter(Boolean).join(' ') || post.username || 'User';
}

function PostCard({ post, onDeleted, showActions = true }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const name = displayName(post);
  const isOwner = Number(user?.id) === Number(post.user_id);
  const isPending = Boolean(post.pending);

  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setDeleteOpen(false);
      notify('Post deleted.', { tone: 'success' });
      if (onDeleted) onDeleted(post.id);
      else router.replace('/feed');
    } catch {
      notify('Could not delete the post. Please try again.', { tone: 'danger' });
    } finally {
      setDeleting(false);
    }
  }

  async function handleShare() {
    if (isPending || sharing) return;
    setSharing(true);
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} on Rangsit Social`, text: post.content, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify('Post link copied.', { tone: 'success' });
      }
    } catch (error) {
      if (error.name !== 'AbortError') notify('Could not share this post.', { tone: 'danger' });
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <Card as="article" className="overflow-hidden" aria-labelledby={`post-${post.id}-author`} aria-busy={isPending || undefined}>
        <header className="flex items-start justify-between gap-3 px-4 pt-4 md:px-5 md:pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/profile/${post.user_id}`} className="shrink-0 rounded-full" aria-label={`View ${name}'s profile`}>
              <Avatar src={post.author_avatar} alt={name} fallback={name} size="md" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link id={`post-${post.id}-author`} href={`/profile/${post.user_id}`} className="truncate text-sm font-semibold text-foreground hover:text-brand-strong">
                  {name}
                </Link>
                {isPending ? <Badge>Publishing</Badge> : null}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted">
                <span>@{post.username || 'student'}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
            </div>
          </div>

          {showActions && isOwner && !isPending ? (
            <Dropdown>
            <DropdownTrigger label="Open post actions" className="h-11 min-h-11 w-11 justify-center p-0 text-foreground-muted [&>svg:last-child]:hidden"><Icon name="more" /></DropdownTrigger>
              <DropdownContent>
                <DropdownItem onSelect={() => router.push(`/posts/${post.id}/edit`)}><Icon name="edit" size="sm" />Edit post</DropdownItem>
                <DropdownItem onSelect={() => setDeleteOpen(true)} className="text-danger hover:bg-danger-subtle hover:text-danger"><Icon name="trash" size="sm" />Delete post</DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : !isPending ? (
            <Link href={`/posts/${post.id}`} className="inline-flex min-h-11 items-center rounded-control px-3 py-2 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground">Open</Link>
          ) : null}
        </header>

        {post.content ? (
          <p className="whitespace-pre-wrap break-words px-4 pt-4 text-[15px] leading-6 text-foreground md:px-5">
            {post.content}
          </p>
        ) : null}

        <PostMedia post={post} authorName={name} />

        <footer className="mx-3 mt-4 grid grid-cols-4 border-t border-border py-2 md:mx-4">
          <LikeButton postId={post.id} initialLiked={Boolean(post.liked)} initialCount={post.like_count} disabled={isPending} />
          <Link
            href={isPending ? '#' : `/posts/${post.id}`}
            aria-disabled={isPending}
            onClick={(event) => { if (isPending) event.preventDefault(); }}
            className="post-action inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-2 text-sm font-medium text-foreground-secondary hover:bg-surface-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Icon name="comment" size="sm" />
            <span className="hidden sm:inline">Comment</span>
            <span>{Number(post.comment_count) || 0}</span>
          </Link>
          <button
            type="button"
            onClick={handleShare}
            disabled={isPending || sharing}
            className="post-action inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-2 text-sm font-medium text-foreground-secondary hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Share post"
          >
            <Icon name="share" size="sm" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <SaveButton postId={post.id} initialSaved={Boolean(post.saved)} disabled={isPending} />
        </footer>
      </Card>

      {deleteOpen ? (
        <Dialog
          open
          onOpenChange={setDeleteOpen}
          title="Delete this post?"
          description="This action is permanent. The post, its likes, and comments will no longer be available."
          size="sm"
          footer={<><Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting} loadingLabel="Deleting">Delete post</Button></>}
        >
          <Badge tone="danger"><Icon name="alert" size="sm" />Permanent action</Badge>
        </Dialog>
      ) : null}
    </>
  );
}

export default memo(PostCard);
