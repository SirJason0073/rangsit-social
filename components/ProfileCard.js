import Link from 'next/link';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import { Card } from './ui/Card';

function displayName(user) {
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  return full || user?.username || user?.email || 'Student';
}

export default function ProfileCard({ user, href, compact = false }) {
  const name = displayName(user);
  const content = (
    <>
      <Avatar src={user?.avatar} alt={name} fallback={name} size={compact ? 'md' : 'lg'} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
        <span className="mt-0.5 block truncate text-xs text-foreground-muted">
          {user?.profile_completed ? `@${user.username || 'student'}` : 'Profile setup required'}
        </span>
      </span>
      {!compact ? <Badge tone={user?.profile_completed ? 'success' : 'warning'}>{user?.profile_completed ? 'Complete' : 'Setup'}</Badge> : null}
    </>
  );

  return (
    <Card className={compact ? 'p-4' : 'p-5'}>
      {href ? <Link href={href} className="flex min-h-11 items-center gap-3 rounded-control">{content}</Link> : <div className="flex items-center gap-3">{content}</div>}
    </Card>
  );
}
