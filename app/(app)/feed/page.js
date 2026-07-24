import FeedList from '@/components/FeedList';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import RouteGuard from '@/components/RouteGuard';

export default function FeedPage() {
  return (
    <RouteGuard requireProfile>
      <div className="mx-auto grid w-full max-w-[94rem] gap-5 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,800px)_280px] xl:gap-6 2xl:grid-cols-[270px_minmax(0,840px)_320px] 2xl:gap-8">
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <LeftSidebar />
          </div>
        </aside>

        <section aria-labelledby="feed-heading" className="min-w-0 space-y-4">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Campus</p>
              <h1 id="feed-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Your feed</h1>
            </div>
            <p className="hidden text-sm text-foreground-muted sm:block">Latest posts first</p>
          </div>
          <FeedList />
        </section>

        <aside className="hidden xl:block">
          <div className="xl:sticky xl:top-24">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </RouteGuard>
  );
}
