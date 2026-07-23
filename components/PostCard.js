'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import { formatDate } from '@/utils/format';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Card } from './ui/Card';
import Dialog from './ui/Dialog';
import Icon from './ui/Icon';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './ui/Dropdown';
import { useToast } from './ui/Toast';

function displayName(post) {
  const full = [post.first_name, post.last_name].filter(Boolean).join(' ');
  return full || post.username || 'User';
}

export default function PostCard({ post, onDeleted, showActions = true }) {
  const { user } = useAuth();
  const router = useRouter();
  const { notify } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const name = displayName(post);
  const isOwner = Number(user?.id) === Number(post.user_id);

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

  return (
    <>
      <Card as="article" className="overflow-hidden" aria-labelledby={`post-${post.id}-author`}>
        <header className="flex items-start justify-between gap-3 px-5 pb-0 pt-5 md:px-6 md:pt-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/profile/${post.user_id}`} className="shrink-0 rounded-full" aria-label={`View ${name}'s profile`}>
              <Avatar src={post.author_avatar} alt={name} fallback={name} size="md" />
            </Link>
            <div className="min-w-0">
              <Link id={`post-${post.id}-author`} href={`/profile/${post.user_id}`} className="block truncate text-sm font-semibold text-foreground hover:text-brand-strong">{name}</Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                {post.media_type ? <><span aria-hidden="true">·</span><span>{post.media_type === 'video' ? 'Video' : 'Photo'}</span></> : null}
              </div>
            </div>
          </div>

          {showActions && isOwner ? (
            <Dropdown>
              <DropdownTrigger label="Open post actions" className="h-10 min-h-10 w-10 justify-center p-0 text-foreground-muted [&>svg:last-child]:hidden"><Icon name="more" /></DropdownTrigger>
              <DropdownContent>
                <DropdownItem onSelect={() => router.push(`/posts/${post.id}/edit`)}><Icon name="edit" size="sm" />Edit post</DropdownItem>
                <DropdownItem onSelect={() => setDeleteOpen(true)} className="text-danger hover:bg-danger-subtle hover:text-danger"><Icon name="trash" size="sm" />Delete post</DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <Link href={`/posts/${post.id}`} className="rounded-control px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground">Open</Link>
          )}
        </header>

        {post.content ? <p className="whitespace-pre-line px-5 pt-4 text-[15px] leading-7 text-foreground-secondary md:px-6">{post.content}</p> : null}

        {post.media_url && post.media_type === 'image' ? (
          <div className="mx-5 mt-4 overflow-hidden rounded-card border border-border bg-surface-muted md:mx-6">
            <Image src={post.media_url} alt={`Photo shared by ${name}`} width={1200} height={900} className="max-h-[36rem] w-full object-contain" />
          </div>
        ) : null}

        {post.media_url && post.media_type === 'video' ? (
          <div className="mx-5 mt-4 overflow-hidden rounded-card border border-border bg-surface-inverse md:mx-6">
            <video src={post.media_url} className="max-h-[36rem] w-full" controls preload="metadata">Your browser does not support video playback.</video>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3 px-5 text-xs text-foreground-muted md:px-6">
          <span>{Number(post.like_count) || 0} likes</span>
          <Link href={`/posts/${post.id}`} className="hover:text-foreground">{Number(post.comment_count) || 0} comments</Link>
        </div>

        <footer className="mt-3 grid grid-cols-3 border-t border-border px-3 py-2 md:px-4">
          <LikeButton postId={post.id} initialLiked={!!post.liked} initialCount={post.like_count} />
          <Link href={`/posts/${post.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-3 text-sm font-medium text-foreground-secondary transition duration-fast hover:bg-surface-muted hover:text-foreground"><Icon name="comment" size="sm" />Comment</Link>
          <SaveButton postId={post.id} initialSaved={!!post.saved} />
        </footer>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete this post?" description="This action is permanent. The post, its likes, and comments will no longer be available." size="sm" footer={<><Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting} loadingLabel="Deleting">Delete post</Button></>}>
        <Badge tone="danger"><Icon name="alert" size="sm" />Permanent action</Badge>
      </Dialog>
    </>
  );
}
