'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from './Providers';
import FollowButton from './FollowButton';
import { formatDateOnly } from '@/utils/format';
import Button from './ui/Button';
import { Card, SubtlePanel } from './ui/Card';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

export default function ProfileHeader({ user, stats }) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <Card className="overflow-hidden p-4 md:p-6">
      <div className="rounded-panel bg-gradient-to-r from-brand-strong via-brand to-accent p-6 text-foreground-inverse shadow-inner md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4 md:gap-5">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName(user)}
                width={96}
                height={96}
                className="h-24 w-24 rounded-panel object-cover ring-2 ring-foreground-inverse/30 md:h-28 md:w-28"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-panel bg-foreground-inverse/10 text-3xl font-semibold text-foreground-inverse md:h-28 md:w-28">
                {displayName(user).slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Campus profile</p>
              <h1 className="mt-2 truncate text-3xl font-semibold tracking-tight md:text-4xl">{displayName(user)}</h1>
              <p className="mt-2 text-sm font-medium text-foreground-inverse/75">@{user.username || 'student'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-foreground-inverse/20 bg-foreground-inverse/10 px-3 py-1 text-xs font-medium text-foreground-inverse">
                  Birthday {formatDateOnly(user.birthday)}
                </span>
                <span className="inline-flex rounded-full border border-foreground-inverse/20 bg-foreground-inverse/10 px-3 py-1 text-xs font-medium text-foreground-inverse">
                  {stats.followers} followers
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isOwnProfile ? (
              <Link href="/profile/edit">
                <Button variant="outline" className="border-foreground-inverse/20 bg-foreground-inverse/10 text-foreground-inverse hover:bg-foreground-inverse/10 hover:text-foreground-inverse">
                  Edit profile
                </Button>
              </Link>
            ) : (
              <FollowButton targetId={user.id} initialFollowing={stats.isFollowing} />
            )}
            <Link href={`/profile/${user.id}/followers`}>
              <Button variant="ghost" className="border border-foreground-inverse/20 bg-foreground-inverse/10 text-foreground-inverse hover:bg-foreground-inverse/20 hover:text-foreground-inverse">
                View network
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-1 pt-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <p className="text-sm leading-7 text-foreground-secondary">{user.bio || 'No bio yet.'}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link href={`/profile/${user.id}/followers`} className="block">
            <SubtlePanel className="p-4 transition hover:border-brand-200 hover:bg-brand-50/70">
              <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Followers</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{stats.followers}</p>
              <p className="mt-1 text-sm text-foreground-muted">People following this profile</p>
            </SubtlePanel>
          </Link>
          <Link href={`/profile/${user.id}/following`} className="block">
            <SubtlePanel className="p-4 transition hover:border-brand-200 hover:bg-brand-50/70">
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
