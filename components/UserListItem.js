'use client';

import Image from 'next/image';
import Link from 'next/link';
import FollowButton from './FollowButton';
import { Card } from './ui/Card';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email || 'User';
}

export default function UserListItem({ user }) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <Link href={`/profile/${user.id}`} className="flex min-w-0 items-center gap-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={displayName(user)}
            width={56}
            height={56}
            className="h-14 w-14 rounded-card object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-card bg-gradient-to-br from-accent-subtle to-brand-subtle text-lg font-semibold text-accent">
            {displayName(user).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{displayName(user)}</p>
          <p className="truncate text-sm text-foreground-muted">@{user.username || 'student'}</p>
          {user.bio ? <p className="mt-1 truncate text-xs text-foreground-muted">{user.bio}</p> : null}
        </div>
      </Link>
      <FollowButton targetId={user.id} initialFollowing={!!user.isFollowing} />
    </Card>
  );
}
