'use client';

import Link from 'next/link';
import { useAuth } from './Providers';
import FollowButton from './FollowButton';
import { formatDateOnly } from '@/utils/format';
import { Card, SubtlePanel } from './ui/Card';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Icon from './ui/Icon';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

export default function ProfileHeader({ user, stats }) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = Number(currentUser?.id) === Number(user.id);
  const name = displayName(user);

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-brand" aria-hidden="true" />
      <div className="p-5 md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4 md:gap-5">
            <Avatar src={user.avatar} alt={name} fallback={name} size="xl" className="ring-4 ring-brand-subtle" />
            <div className="min-w-0">
              <Badge><Icon name="user" size="sm" />Campus profile</Badge>
              <h1 className="mt-3 truncate text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{name}</h1>
              <p className="mt-1 text-sm font-medium text-foreground-muted">@{user.username || 'student'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Birthday {formatDateOnly(user.birthday)}</Badge>
                <Badge tone="neutral">{stats.followers} followers</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isOwnProfile ? (
              <Link href="/profile/edit" className="btn btn-outline"><Icon name="edit" size="sm" />Edit profile</Link>
            ) : (
              <FollowButton targetId={user.id} initialFollowing={stats.isFollowing} />
            )}
            <Link href={`/profile/${user.id}/followers`} className="btn btn-ghost"><Icon name="users" size="sm" />View network</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-border px-5 py-5 md:px-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <p className="text-sm leading-7 text-foreground-secondary">{user.bio || 'No bio yet.'}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link href={`/profile/${user.id}/followers`} className="block rounded-card">
            <SubtlePanel className="p-4 transition duration-fast hover:border-brand hover:bg-brand-subtle">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Followers</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.followers}</p>
              <p className="mt-1 text-sm text-foreground-muted">People following this profile</p>
            </SubtlePanel>
          </Link>
          <Link href={`/profile/${user.id}/following`} className="block rounded-card">
            <SubtlePanel className="p-4 transition duration-fast hover:border-brand hover:bg-brand-subtle">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Following</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.following}</p>
              <p className="mt-1 text-sm text-foreground-muted">Profiles this user follows</p>
            </SubtlePanel>
          </Link>
        </div>
      </div>
    </Card>
  );
}
