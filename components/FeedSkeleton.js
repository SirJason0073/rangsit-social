import { Card } from './ui/Card';
import { Skeleton, SkeletonAvatar } from './ui/Skeleton';

export default function FeedSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4" aria-label="Loading posts" role="status">
      <span className="sr-only">Loading posts</span>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden p-5 md:p-6">
          <div className="flex items-center gap-3">
            <SkeletonAvatar />
            <div className="flex-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-5 aspect-[16/9] w-full rounded-card" />
          <div className="mt-5 grid grid-cols-4 gap-3 border-t border-border pt-4">
            {Array.from({ length: 4 }).map((__, actionIndex) => (
              <Skeleton key={actionIndex} className="h-9 rounded-control" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
