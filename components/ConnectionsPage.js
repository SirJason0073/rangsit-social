'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import { Card } from './ui/Card';
import EmptyState from './ui/EmptyState';
import ErrorState from './ui/ErrorState';
import { FieldLabel, TextInput } from './ui/Field';
import Icon from './ui/Icon';
import { Skeleton, SkeletonAvatar } from './ui/Skeleton';
import UserListItem from './UserListItem';

function displayName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Student';
}

export default function ConnectionsPage({ kind }) {
  const params = useParams();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    try {
      const [usersResponse, profileResponse, suggestionsResponse] = await Promise.all([
        fetch(`/api/users/${params.id}/${kind}?page=1&limit=12`, { cache: 'no-store' }),
        fetch(`/api/users/${params.id}?page=1&limit=1`, { cache: 'no-store' }),
        fetch('/api/users/suggestions', { cache: 'no-store' })
      ]);
      const usersData = await usersResponse.json();
      const profileData = await profileResponse.json();
      const suggestionsData = suggestionsResponse.ok ? await suggestionsResponse.json() : { users: [] };
      if (!usersResponse.ok || !profileResponse.ok) {
        throw new Error(usersData.message || profileData.message || 'Connections could not be loaded.');
      }
      setUsers(usersData.users || []);
      setHasMore(Boolean(usersData.pagination?.hasMore));
      setTotal(Number(usersData.pagination?.total) || 0);
      setPage(1);
      setProfile(profileData.user || null);
      setSuggestions((suggestionsData.users || []).slice(0, 4));
    } catch (requestError) {
      setError(requestError.message || 'Connections could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [kind, params.id]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/users/${params.id}/${kind}?page=${nextPage}&limit=12`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'More people could not be loaded.');
      setUsers((current) => [...current, ...(data.users || [])]);
      setHasMore(Boolean(data.pagination?.hasMore));
      setPage(nextPage);
    } catch (requestError) {
      setError(requestError.message || 'More people could not be loaded.');
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) => {
      const searchable = `${user.first_name || ''} ${user.last_name || ''} ${user.username || ''}`.toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [query, users]);

  const name = displayName(profile);
  const title = kind === 'followers' ? 'Followers' : 'Following';

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <Skeleton className="h-40 rounded-panel" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="flex items-center gap-3 p-4"><SkeletonAvatar /><div className="flex-1"><Skeleton className="h-3 w-28" /><Skeleton className="mt-2 h-3 w-20" /></div></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return <ErrorState title="Unable to load connections" description={error} onRetry={() => { setLoading(true); loadData(); }} />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Card className="overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-brand-strong via-brand to-accent" />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-7 flex min-w-0 items-end gap-3">
            <Avatar src={profile?.avatar} alt={name} fallback={name} size="lg" className="rounded-full bg-surface-elevated p-1" />
            <div className="min-w-0 pb-1">
              <h1 className="truncate text-xl font-semibold text-foreground">{name}</h1>
              <p className="text-sm text-foreground-muted">@{profile?.username || 'student'}</p>
            </div>
          </div>
          <Link href={`/profile/${params.id}`} className="btn btn-outline">View profile</Link>
        </div>
        <nav aria-label="Connection lists" className="flex border-t border-border px-3">
          <Link href={`/profile/${params.id}/followers`} aria-current={kind === 'followers' ? 'page' : undefined} className={kind === 'followers' ? 'nav-pill-active' : 'nav-pill'}>Followers</Link>
          <Link href={`/profile/${params.id}/following`} aria-current={kind === 'following' ? 'page' : undefined} className={kind === 'following' ? 'nav-pill-active' : 'nav-pill'}>Following</Link>
        </nav>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-4" aria-labelledby="connection-list-title">
          <Card className="p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">People</p>
                <h2 id="connection-list-title" className="mt-1 text-xl font-semibold text-foreground">{title} <span className="text-foreground-muted">· {total}</span></h2>
              </div>
              <div className="w-full sm:max-w-xs">
                <FieldLabel htmlFor="connection-search">Search loaded people</FieldLabel>
                <TextInput id="connection-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or username" className="mt-1" />
              </div>
            </div>
          </Card>

          {filteredUsers.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredUsers.map((user) => <UserListItem key={user.id} user={user} />)}
            </div>
          ) : query ? (
            <EmptyState icon={<Icon name="users" />} title="No matching people" description="Try another name or username in the currently loaded list." />
          ) : (
            <EmptyState
              icon={<Icon name="users" />}
              title={kind === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              description={kind === 'followers' ? 'New followers will appear here.' : 'Profiles followed by this student will appear here.'}
            />
          )}

          {error ? <p role="alert" className="text-center text-sm text-danger">{error}</p> : null}
          {hasMore ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={loadMore} loading={loadingMore} loadingLabel="Loading people">Load more</Button>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <Card className="p-4 md:p-5">
            <h2 className="text-sm font-semibold text-foreground">Discover people</h2>
            <p className="mt-1 text-xs leading-5 text-foreground-muted">Students you may want to connect with.</p>
            <div className="mt-3 divide-y divide-border">
              {suggestions.length
                ? suggestions.map((user) => <UserListItem key={user.id} user={user} compact />)
                : <p className="py-4 text-sm text-foreground-muted">No suggestions right now.</p>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
