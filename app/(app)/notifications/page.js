import RouteGuard from '@/components/RouteGuard';
import NotificationCenter from '@/components/NotificationCenter';

export default function NotificationsPage() {
  return (
    <RouteGuard requireProfile>
      <NotificationCenter />
    </RouteGuard>
  );
}
