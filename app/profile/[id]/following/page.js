'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import RouteGuard from '@/components/RouteGuard';
import UserListItem from '@/components/UserListItem';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FollowingPage() {
  const params = useParams();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [usersRes, profileRes] = await Promise.all([
        fetch(`/api/users/${params.id}/following?page=1&limit=8`),
        fetch(`/api/users/${params.id}`)
      ]);

      const usersData = await usersRes.json();
      const profileData = await profileRes.json();

      setUsers(usersData.users || []);
      setHasMore(!!usersData.pagination?.hasMore);
      setPage(1);
      setProfile(profileData.user || null);
      setLoading(false);
    }

    loadData();
  }, [params.id]);

  async function handleLoadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/users/${params.id}/following?page=${nextPage}&limit=8`);
    const data = await res.json();
    setUsers((prev) => [...prev, ...(data.users || [])]);
    setHasMore(!!data.pagination?.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  }

  if (loading) return <Loading label="Loading following..." />;

  return (
    <RouteGuard requireProfile>
      <div className="space-y-6">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Connections</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {profile?.first_name || profile?.username || 'User'} is following
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Profiles this user currently follows.
          </p>
          <Link href={`/profile/${params.id}`} className="link mt-4 inline-flex text-sm">
            Back to profile
          </Link>
        </Card>

        {users.length ? (
          <div className="space-y-4">
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
            {hasMore ? (
              <div className="flex justify-center pt-2">
                <Button onClick={handleLoadMore} disabled={loadingMore} variant="outline">
                  {loadingMore ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState title="Not following anyone yet" description="This user has not followed any profiles yet." />
        )}
      </div>
    </RouteGuard>
  );
}
