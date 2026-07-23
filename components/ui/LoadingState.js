import { Card } from './Card';
import { Skeleton, SkeletonText } from './Skeleton';

export default function LoadingState({ label = 'Loading content' }) {
  return (
    <div role="status" aria-label={label} className="space-y-4">
      <Card className="p-card">
        <div className="flex items-center gap-3">
          <Skeleton className="avatar-md rounded-full" />
          <div className="flex-1"><Skeleton className="h-4 w-36" /><Skeleton className="mt-2 h-3 w-28" /></div>
        </div>
        <SkeletonText lines={3} className="mt-5" />
        <Skeleton className="mt-5 h-64 w-full rounded-card" />
      </Card>
      <span className="sr-only">{label}</span>
    </div>
  );
}
