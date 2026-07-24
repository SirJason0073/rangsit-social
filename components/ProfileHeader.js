'use client';

import Link from 'next/link';
import { useAuth } from './Providers';
import FollowButton from './FollowButton';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import Icon from './ui/Icon';

function displayName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email;
}

export default function ProfileHeader({ user, stats, onRelationshipChange }) {
  const { user: currentUser } = useAuth();
  const isOwnProfile = Number(currentUser?.id) === Number(user.id);
  const name = displayName(user);

  return (
    <section className="overflow-hidden rounded-panel border border-border bg-surface-elevated shadow-1" aria-labelledby="profile-name">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-strong via-brand to-accent sm:h-44 md:h-52">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-foreground-inverse/15 shadow-[0_0_0_3rem_rgb(var(--color-text-inverse)/0.04),0_0_0_6rem_rgb(var(--color-text-inverse)/0.03)]" aria-hidden="true" />
        <div className="absolute bottom-5 right-6 hidden text-right text-foreground-inverse/70 sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em]">Rangsit Social</p>
          <p className="mt-1 text-sm">Campus profile</p>
        </div>
      </div>

      <div className="relative px-4 pb-5 sm:px-6 md:px-8">
        <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
          <Avatar
            src={user.avatar}
            alt={name}
            fallback={name}
            size="xl"
            className="h-28 w-28 rounded-full bg-surface-elevated p-1 ring-0 sm:h-32 sm:w-32"
          />
          <div className="flex flex-wrap gap-2 sm:pb-2">
            {isOwnProfile ? (
              <Link href="/profile/edit" className="btn btn-outline"><Icon name="edit" size="sm" />Edit profile</Link>
            ) : (
              <FollowButton
                targetId={user.id}
                initialFollowing={stats.isFollowing}
                onChange={onRelationshipChange}
              />
            )}
          </div>
        </div>

        <div className="mt-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <h1 id="profile-name" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{name}</h1>
            {isOwnProfile ? <Badge tone="neutral">Your profile</Badge> : null}
          </div>
          <p className="mt-1 text-sm font-medium text-foreground-muted">@{user.username || 'student'}</p>
          <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-foreground-secondary">
            {user.bio || (isOwnProfile ? 'Add a short bio so people know more about you.' : 'This student has not added a bio yet.')}
          </p>
        </div>

        <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4 text-sm">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-foreground-muted">Posts</dt>
            <dd className="font-semibold text-foreground">{stats.posts || 0}</dd>
          </div>
          <Link href={`/profile/${user.id}/followers`} className="group inline-flex min-h-11 items-center gap-1.5 rounded-control px-1">
            <dt className="text-foreground-muted group-hover:text-foreground">Followers</dt>
            <dd className="font-semibold text-foreground group-hover:text-brand-strong">{stats.followers || 0}</dd>
          </Link>
          <Link href={`/profile/${user.id}/following`} className="group inline-flex min-h-11 items-center gap-1.5 rounded-control px-1">
            <dt className="text-foreground-muted group-hover:text-foreground">Following</dt>
            <dd className="font-semibold text-foreground group-hover:text-brand-strong">{stats.following || 0}</dd>
          </Link>
        </dl>
      </div>
    </section>
  );
}
