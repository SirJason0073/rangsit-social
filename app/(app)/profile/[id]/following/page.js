import ConnectionsPage from '@/components/ConnectionsPage';
import RouteGuard from '@/components/RouteGuard';

export default function FollowingPage() {
  return (
    <RouteGuard requireProfile>
      <ConnectionsPage kind="following" />
    </RouteGuard>
  );
}
