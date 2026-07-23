'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import PostForm from '@/components/PostForm';
import Loading from '@/components/Loading';
import { Card, SubtlePanel } from '@/components/ui/Card';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();
      setPost(data.post);
      setLoading(false);
    }
    loadPost();
  }, [params.id]);

  if (loading) return <Loading label="Loading post..." />;
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>;

  async function handleSubmit(formData) {
    const res = await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      body: formData
    });
    if (res.ok) {
      router.push(`/posts/${params.id}`);
    } else {
      throw new Error('Failed to update post');
    }
  }

  return (
    <RouteGuard requireProfile>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
        <Card className="p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Edit</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Refine your post</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Update the message, replace the media, or remove it entirely before publishing the revised version.
          </p>
        </Card>
          <PostForm submitLabel="Update" onSubmit={handleSubmit} initial={post} />
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Editing notes</h2>
            <div className="mt-4 grid gap-3">
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Keep the message current</p>
                <p className="mt-1 text-sm text-slate-500">Use edits for corrections, clearer wording, or updated event details.</p>
              </SubtlePanel>
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Media can be replaced</p>
                <p className="mt-1 text-sm text-slate-500">Remove the current media if the post reads better as text only.</p>
              </SubtlePanel>
            </div>
          </Card>
        </aside>
      </div>
    </RouteGuard>
  );
}
