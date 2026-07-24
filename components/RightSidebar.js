'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './Providers';
import UserListItem from './UserListItem';
import { Card } from './ui/Card';
import { Skeleton, SkeletonAvatar } from './ui/Skeleton';
import Icon from './ui/Icon';

const trends = ['#RangsitLife', '#CampusEvents', '#StudySession', '#StudentCreators', '#RsuUpdates'];
export default function RightSidebar() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadSidebarData() {
      if (!user?.id || !user.profile_completed) {
        setLoading(false);
        return;
      }

      try {
        const [suggestionsRes, profileRes] = await Promise.all([
          fetch('/api/users/suggestions?limit=12', { signal: controller.signal, cache: 'no-store' }),
          fetch(`/api/users/${user.id}?includePosts=false`, { signal: controller.signal })
        ]);
        if (!suggestionsRes.ok || !profileRes.ok) throw new Error('Sidebar data failed');

        const suggestionsData = await suggestionsRes.json();
        const profileData = await profileRes.json();

        setSuggestions(suggestionsData.users || []);
        setStats({
          posts: profileData.pagination?.total || 0,
          followers: profileData.stats?.followers || 0,
          following: profileData.stats?.following || 0
        });
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadSidebarData();
    return () => controller.abort();
  }, [user?.id, user?.profile_completed]);

  const visibleSuggestions = suggestions.slice(0, 4);

  return (
    <div className="space-y-5">
      <Card as="section" className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Who to follow</h2>
          <Link href="/search?type=people" className="link text-xs font-semibold">
            Show all
          </Link>
        </div>
        <div className="mt-3 divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <div key={index} className="flex items-center gap-3 py-3"><SkeletonAvatar /><div className="flex-1"><Skeleton className="h-3 w-24" /><Skeleton className="mt-2 h-3 w-16" /></div><Skeleton className="h-9 w-20 rounded-control" /></div>)
          ) : error ? (
            <p className="py-4 text-sm text-foreground-muted">Suggestions are temporarily unavailable.</p>
          ) : visibleSuggestions.length ? (
            visibleSuggestions.map((suggestion) => (
              <UserListItem
                key={suggestion.id}
                user={suggestion}
                compact
                onFollowChange={(following) => {
                  if (following) {
                    setSuggestions((current) => current.filter((item) => String(item.id) !== String(suggestion.id)));
                  }
                }}
              />
            ))
          ) : (
            <p className="text-sm text-foreground-muted">No suggestions right now.</p>
          )}
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Campus topics</h2>
        <div className="mt-3 divide-y divide-border">
          {trends.map((trend) => (
            <Link key={trend} href={`/search?q=${encodeURIComponent(trend.slice(1))}&type=campus`} className="block py-3 hover:text-brand-strong">
              <p className="text-sm font-semibold text-brand-strong">{trend}</p>
              <p className="mt-0.5 text-xs text-foreground-muted">Search campus posts</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card as="section" className="p-5" aria-busy={loading}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Quick stats</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-control bg-surface-muted px-2 py-3 text-center">
            <p className="text-lg font-semibold text-foreground">{stats.posts}</p>
            <p className="mt-1 text-xs text-foreground-muted">Posts</p>
          </div>
          <div className="rounded-control bg-surface-muted px-2 py-3 text-center">
            <p className="text-lg font-semibold text-foreground">{stats.followers}</p>
            <p className="mt-1 text-xs text-foreground-muted">Followers</p>
          </div>
          <div className="rounded-control bg-surface-muted px-2 py-3 text-center">
            <p className="text-lg font-semibold text-foreground">{stats.following}</p>
            <p className="mt-1 text-xs text-foreground-muted">Following</p>
          </div>
        </div>
      </Card>

      <Card as="aside" className="flex items-start gap-3 p-5">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-strong"><Icon name="users" size="sm" /></span>
        <div><p className="text-sm font-semibold text-foreground">Build your campus network</p><p className="mt-1 text-xs leading-5 text-foreground-muted">Follow classmates to make your feed more relevant.</p></div>
      </Card>
    </div>
  );
}
