'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs from '@/components/ProfileTabs';
import Loading from '@/components/Loading';
import RouteGuard from '@/components/RouteGuard';
import ErrorState from '@/components/ui/ErrorState';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [initialPosts, setInitialPosts] = useState([]);
  const [initialPagination, setInitialPagination] = useState(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setError('');
    try {
      const response = await fetch(`/api/users/${params.id}?page=1&limit=6`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Profile could not be loaded.');
      setProfile(data.user);
      setInitialPosts(data.posts || []);
      setInitialPagination(data.pagination || null);
      setStats({
        followers: Number(data.stats?.followers) || 0,
        following: Number(data.stats?.following) || 0,
        isFollowing: Boolean(data.stats?.isFollowing),
        posts: Number(data.pagination?.total) || 0
      });
    } catch (requestError) {
      setProfile(null);
      setError(requestError.message || 'Profile could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    setLoading(true);
    loadProfile();
  }, [loadProfile]);

  function handleRelationshipChange(isFollowing) {
    setStats((current) => {
      if (current.isFollowing === isFollowing) return current;
      return {
        ...current,
        isFollowing,
        followers: Math.max(0, current.followers + (isFollowing ? 1 : -1))
      };
    });
  }

  return (
    <RouteGuard requireProfile>
      {loading ? <Loading label="Loading profile..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load profile" description={error} onRetry={() => { setLoading(true); loadProfile(); }} /> : null}
      {!loading && profile ? (
        <div className="mx-auto max-w-5xl space-y-6">
          <ProfileHeader user={profile} stats={stats} onRelationshipChange={handleRelationshipChange} />
          <ProfileTabs user={profile} initialPosts={initialPosts} initialPagination={initialPagination} />
        </div>
      ) : null}
    </RouteGuard>
  );
}
