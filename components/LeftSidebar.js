'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './Providers';
import { Card, SubtlePanel } from './ui/Card';

function displayName(user) {
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  return full || user?.username || user?.email || 'Student';
}

export default function LeftSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-5">
      <Card as="section" className="p-5">
        <Link href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'} className="flex items-center gap-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={displayName(user)}
              width={56}
              height={56}
              className="h-14 w-14 rounded-card object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-card bg-brand-100 text-lg font-semibold text-brand-700">
              {displayName(user).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{displayName(user)}</p>
            <p className="truncate text-xs text-foreground-muted">
              {user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}
            </p>
          </div>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SubtlePanel className="p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Profile</p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {user.profile_completed ? 'Complete' : 'Setup needed'}
            </p>
          </SubtlePanel>
          <SubtlePanel className="p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Status</p>
            <p className="mt-2 text-sm font-semibold text-foreground">Campus active</p>
          </SubtlePanel>
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Shortcuts</h2>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/feed" className="rounded-card px-4 py-3 text-sm font-medium text-foreground-secondary transition hover:bg-brand-50 hover:text-brand-700">
            Feed
          </Link>
          <Link href="/posts/new" className="rounded-card px-4 py-3 text-sm font-medium text-foreground-secondary transition hover:bg-brand-50 hover:text-brand-700">
            Create post
          </Link>
          <Link href={`/profile/${user.id}`} className="rounded-card px-4 py-3 text-sm font-medium text-foreground-secondary transition hover:bg-brand-50 hover:text-brand-700">
            My profile
          </Link>
          <Link href="/saved" className="rounded-card px-4 py-3 text-sm font-medium text-foreground-secondary transition hover:bg-brand-50 hover:text-brand-700">
            Saved posts
          </Link>
          {!user.profile_completed ? (
            <Link href="/onboarding" className="rounded-card px-4 py-3 text-sm font-medium text-foreground-secondary transition hover:bg-brand-50 hover:text-brand-700">
              Complete onboarding
            </Link>
          ) : null}
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Campus spaces</h2>
        <div className="mt-4 space-y-2">
          {['Student clubs', 'Creative showcase', 'Study groups', 'Events board'].map((item) => (
            <div key={item} className="rounded-card bg-surface-muted px-4 py-3 text-sm font-medium text-foreground-secondary">
              {item}
            </div>
          ))}
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Saved & planning</h2>
        <div className="mt-4 grid gap-3">
          <div className="rounded-card bg-brand-50 px-4 py-3">
            <p className="text-sm font-semibold text-brand-800">Bookmarks</p>
            <p className="mt-1 text-xs leading-5 text-foreground-muted">Keep posts and ideas you want to revisit.</p>
          </div>
          <div className="rounded-card bg-surface-muted px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Upcoming events</p>
            <p className="mt-1 text-xs leading-5 text-foreground-muted">Quick access to student activities and club news.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
