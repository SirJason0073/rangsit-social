import { cn } from '@/utils/cn';

export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={cn('skeleton', className)} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('h-4', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }) {
  return <Skeleton className={cn(`avatar-${size} shrink-0 rounded-full`, className)} />;
}

export function SkeletonCard({ media = false, className = '' }) {
  return (
    <div aria-hidden="true" className={cn('card p-card', className)}>
      <div className="flex items-center gap-3"><SkeletonAvatar /><div className="flex-1"><Skeleton className="h-4 w-32" /><Skeleton className="mt-2 h-3 w-24" /></div></div>
      <SkeletonText lines={3} className="mt-5" />
      {media ? <Skeleton className="mt-5 aspect-video w-full rounded-card" /> : null}
    </div>
  );
}
