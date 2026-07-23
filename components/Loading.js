import { Card } from './ui/Card';
import { Skeleton, SkeletonText } from './ui/Skeleton';

export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        </div>
        <SkeletonText lines={3} className="mt-5" />
        <Skeleton className="mt-5 h-72 w-full rounded-[28px]" />
      </Card>
      <p className="text-center text-sm text-slate-500">{label}</p>
    </div>
  );
}
