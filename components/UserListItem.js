'use client';

import Link from 'next/link';
import FollowButton from './FollowButton';
import { Card } from './ui/Card';
import Avatar from './ui/Avatar';

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email || 'User';
}

export default function UserListItem({ user, compact = false }) {
  const name = displayName(user);
  const Wrapper = compact ? 'div' : Card;
  return (
    <Wrapper className={`flex items-center justify-between gap-3 ${compact ? 'py-2' : 'p-4'}`}>
      <Link href={`/profile/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-control">
        <Avatar src={user.avatar} alt={name} fallback={name} size={compact ? 'md' : 'lg'} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="truncate text-sm text-foreground-muted">@{user.username || 'student'}</p>
          {!compact && user.bio ? <p className="mt-1 line-clamp-1 text-xs text-foreground-muted">{user.bio}</p> : null}
        </div>
      </Link>
      <FollowButton targetId={user.id} initialFollowing={!!user.isFollowing} size={compact ? 'sm' : 'md'} />
    </Wrapper>
  );
}
