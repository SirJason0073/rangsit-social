import ConnectionsPage from '@/components/ConnectionsPage';
import RouteGuard from '@/components/RouteGuard';

export default function FollowersPage() {
  return (
    <RouteGuard requireProfile>
      <ConnectionsPage kind="followers" />
    </RouteGuard>
  );
}
