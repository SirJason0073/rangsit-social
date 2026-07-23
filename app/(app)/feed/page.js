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

        <section aria-label="Campus feed" className="min-w-0 space-y-5">
          <div className="glass-panel overflow-hidden p-4 md:p-5">
            <div className="rounded-panel bg-gradient-to-r from-brand-strong via-brand to-accent px-6 py-7 text-foreground-inverse md:px-8 md:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground-inverse/80">Campus feed</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">What students are sharing today</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground-inverse/80">
                Follow classmates, discover campus updates, and share moments in a feed that feels like a modern university social product.
              </p>
            </div>
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
