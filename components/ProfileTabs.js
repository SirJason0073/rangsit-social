'use client';

import dynamic from 'next/dynamic';
import FeedList from './FeedList';
import Tabs from './ui/Tabs';
import Badge from './ui/Badge';
import { Card } from './ui/Card';
import Icon from './ui/Icon';
import { Skeleton } from './ui/Skeleton';
import { formatDateOnly } from '@/utils/format';

const ProfileMediaGrid = dynamic(() => import('./ProfileMediaGrid'), {
  loading: () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Loading profile media">
      {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="aspect-square rounded-card" />)}
    </div>
  )
});

function AboutProfile({ user }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-subtle text-brand-strong"><Icon name="user" size="sm" /></span>
          <div>
            <h2 className="font-semibold text-foreground">About</h2>
            <p className="text-xs text-foreground-muted">Profile information</p>
          </div>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-foreground-muted">Username</dt>
            <dd className="mt-1 font-medium text-foreground">@{user.username || 'student'}</dd>
          </div>
          <div>
            <dt className="text-foreground-muted">Bio</dt>
            <dd className="mt-1 whitespace-pre-wrap leading-6 text-foreground">{user.bio || 'No bio added.'}</dd>
          </div>
          <div>
            <dt className="text-foreground-muted">Member since</dt>
            <dd className="mt-1 font-medium text-foreground">{formatDateOnly(user.created_at)}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle text-accent"><Icon name="shield" size="sm" /></span>
          <div>
            <h2 className="font-semibold text-foreground">Visibility</h2>
            <p className="text-xs text-foreground-muted">Who can see this information</p>
          </div>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <dt className="text-foreground-muted">Birthday</dt>
              <dd className="mt-1 font-medium text-foreground">{formatDateOnly(user.birthday)}</dd>
            </div>
            <Badge tone="neutral">Signed-in members</Badge>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <dt className="text-foreground-muted">Profile and posts</dt>
              <dd className="mt-1 text-foreground-secondary">Visible inside the campus network</dd>
            </div>
            <Badge tone="neutral">Community</Badge>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export default function ProfileTabs({ user, initialPosts, initialPagination }) {
  return (
    <Tabs
      label={`${user.username || 'User'} profile sections`}
      defaultValue="posts"
      items={[
        {
          id: 'posts',
          label: 'Posts',
          content: (
            <FeedList
              endpoint={`/api/users/${user.id}`}
              initialPosts={initialPosts}
              initialPagination={initialPagination}
              emptyTitle="No posts yet"
              emptyDescription="Posts from this profile will appear here."
            />
          )
        },
        {
          id: 'media',
          label: 'Media',
          content: (
            <ProfileMediaGrid
              userId={user.id}
              initialPosts={initialPosts}
              initialPagination={initialPagination}
            />
          )
        },
        {
          id: 'about',
          label: 'About',
          content: <AboutProfile user={user} />
        }
      ]}
    />
  );
}
