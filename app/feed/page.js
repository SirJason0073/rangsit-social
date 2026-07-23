import FeedList from '@/components/FeedList';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_340px] xl:gap-6">
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <LeftSidebar />
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="glass-panel overflow-hidden p-4 md:p-5">
            <div className="rounded-[30px] bg-gradient-to-r from-brand-900 via-brand-800 to-sky-500 px-6 py-7 text-white md:px-8 md:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100">Campus feed</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">What students are sharing today</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-50/90">
                Follow classmates, discover campus updates, and share moments in a feed that feels like a modern university social product.
              </p>
            </div>
          </div>
          <FeedList />
        </main>

        <aside className="hidden xl:block">
          <div className="xl:sticky xl:top-24">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </RouteGuard>
  );
}
