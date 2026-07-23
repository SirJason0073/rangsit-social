'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';
import FeedList from '@/components/FeedList';
import Loading from '@/components/Loading';
import RouteGuard from '@/components/RouteGuard';
import { Card, SubtlePanel } from '@/components/ui/Card';
import { formatDateOnly } from '@/utils/format';

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const res = await fetch(`/api/users/${params.id}`);
    const data = await res.json();
    setProfile(data.user);
    setStats(data.stats || { followers: 0, following: 0, isFollowing: false });
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  if (loading) return <Loading label="Loading profile..." />;
  if (!profile) return <p className="text-sm text-foreground-muted">User not found.</p>;

  return (
    <RouteGuard requireProfile>
      <div className="space-y-8">
        <ProfileHeader user={profile} stats={stats} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Posts</h2>
              <p className="text-sm text-foreground-muted">Recent posts</p>
            </div>
            <FeedList
              endpoint={`/api/users/${params.id}`}
              emptyTitle="No posts yet"
              emptyDescription="This user hasn't posted anything yet."
            />
          </section>

          <aside className="space-y-4">
            <Card className="p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-muted">Profile details</h2>
              <div className="mt-4 grid gap-3">
                <SubtlePanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Username</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">@{profile.username || 'student'}</p>
                </SubtlePanel>
                <SubtlePanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Birthday</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{formatDateOnly(profile.birthday)}</p>
                </SubtlePanel>
                <SubtlePanel className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Network</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {stats.followers} followers · {stats.following} following
                  </p>
                </SubtlePanel>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </RouteGuard>
  );
}
