import { Suspense } from 'react';
import RouteGuard from '@/components/RouteGuard';
import SearchExperience from '@/components/SearchExperience';
import Loading from '@/components/Loading';

export default function SearchPage() {
  return (
    <RouteGuard requireProfile>
      <Suspense fallback={<Loading label="Opening search..." />}>
        <SearchExperience />
      </Suspense>
    </RouteGuard>
  );
}
