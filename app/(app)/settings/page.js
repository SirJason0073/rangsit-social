import RouteGuard from '@/components/RouteGuard';
import SettingsDashboard from '@/components/SettingsDashboard';

export default function SettingsPage() {
  return (
    <RouteGuard>
      <SettingsDashboard />
    </RouteGuard>
  );
}
