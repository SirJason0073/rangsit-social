'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import CommentList from '@/components/CommentList';
import Loading from '@/components/Loading';
import RouteGuard from '@/components/RouteGuard';
import { Card, SubtlePanel } from '@/components/ui/Card';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadPost() {
    const res = await fetch(`/api/posts/${params.id}`);
    const data = await res.json();
    setPost(data.post);
    setLoading(false);
  }

  useEffect(() => {
    loadPost();
  }, [params.id]);

  if (loading) return <Loading label="Loading post..." />;
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>;

  return (
    <RouteGuard requireProfile>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Card className="p-6">
          <Link href="/feed" className="link inline-flex text-sm">
            Back to feed
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Post detail</h1>
          <p className="mt-2 text-sm text-slate-500">
            View the full conversation, media, and engagement around this post.
          </p>
          </Card>
          <PostCard post={post} showActions />
          <CommentList postId={post.id} />
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Engagement</h2>
            <div className="mt-4 grid gap-3">
              <SubtlePanel className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Likes</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{post.like_count || 0}</p>
              </SubtlePanel>
              <SubtlePanel className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Comments</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{post.comment_count || 0}</p>
              </SubtlePanel>
              <SubtlePanel className="p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Author</p>
                <Link href={`/profile/${post.user_id}`} className="mt-2 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800">
                  View profile
                </Link>
              </SubtlePanel>
            </div>
          </Card>
        </aside>
      </div>
    </RouteGuard>
  );
}
