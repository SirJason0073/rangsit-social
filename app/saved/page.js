import FeedList from '@/components/FeedList';
import RouteGuard from '@/components/RouteGuard';
import { Card, SubtlePanel } from '@/components/ui/Card';

export default function SavedPostsPage() {
  return (
    <RouteGuard requireProfile>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Card className="p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Saved</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Saved posts</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Keep the posts you want to revisit later in one place.
            </p>
          </Card>
          <FeedList
            endpoint="/api/saved-posts"
            emptyTitle="No saved posts yet"
            emptyDescription="Save posts from the feed to build your own reading list."
          />
        </div>
        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How to use saved posts</h2>
            <div className="mt-4 grid gap-3">
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Build a reading list</p>
                <p className="mt-1 text-sm text-slate-500">Keep event announcements, study resources, and useful updates in one place.</p>
              </SubtlePanel>
              <SubtlePanel className="p-4">
                <p className="text-sm font-semibold text-slate-950">Return later</p>
                <p className="mt-1 text-sm text-slate-500">Saved posts stay attached to your account until you remove them.</p>
              </SubtlePanel>
            </div>
          </Card>
        </aside>
      </div>
    </RouteGuard>
  );
}
