'use client';

import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import PostForm from '@/components/PostForm';
import { Card, SubtlePanel } from '@/components/ui/Card';

export default function NewPostPage() {
  const router = useRouter();

  async function handleSubmit(formData) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      router.push('/feed');
    } else {
      throw new Error('Failed to create post');
    }
  }

  return (
    <RouteGuard requireProfile>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
        <Card className="p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Create</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Share something worth seeing</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Post an update, event, or idea to the campus feed. Add one image or video when the story needs it.
          </p>
        </Card>
          <PostForm submitLabel="Publish" onSubmit={handleSubmit} />
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Posting tips</h2>
            <div className="mt-4 grid gap-3">
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Lead with the point</p>
                <p className="mt-1 text-sm text-slate-500">Short, clear updates perform better in the campus feed.</p>
              </SubtlePanel>
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Use one strong media file</p>
                <p className="mt-1 text-sm text-slate-500">A single image or video keeps the post clean and fast to load.</p>
              </SubtlePanel>
            </div>
          </Card>
        </aside>
      </div>
    </RouteGuard>
  );
}
