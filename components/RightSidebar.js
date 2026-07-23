'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from './Providers';
import FollowButton from './FollowButton';
import { Card } from './ui/Card';

const trends = ['#RangsitLife', '#CampusEvents', '#StudySession', '#StudentCreators', '#RsuUpdates'];
const activity = ['New follows this week', 'Comments on your recent post', 'Student event signups rising'];

function displayName(user) {
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email || 'User';
}

export default function RightSidebar() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSidebarData() {
      if (!user?.id || !user.profile_completed) return;

      try {
        const [suggestionsRes, profileRes] = await Promise.all([
          fetch('/api/users/suggestions'),
          fetch(`/api/users/${user.id}`)
        ]);

        const suggestionsData = await suggestionsRes.json();
        const profileData = await profileRes.json();

        setSuggestions(suggestionsData.users || []);
        setStats({
          posts: profileData.posts?.length || 0,
          followers: profileData.stats?.followers || 0,
          following: profileData.stats?.following || 0
        });
      } finally {
        setLoading(false);
      }
    }

    loadSidebarData();
  }, [user?.id, user?.profile_completed]);

  const visibleSuggestions = useMemo(() => suggestions.slice(0, 4), [suggestions]);

  return (
    <div className="space-y-5">
      <Card as="section" className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Who to follow</h2>
          <Link href={user ? `/profile/${user.id}/following` : '/feed'} className="text-xs font-medium text-brand-700 hover:text-brand-800">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading suggestions...</p>
          ) : visibleSuggestions.length ? (
            visibleSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between gap-3">
                <Link href={`/profile/${suggestion.id}`} className="flex min-w-0 items-center gap-3">
                  {suggestion.avatar ? (
                    <Image
                      src={suggestion.avatar}
                      alt={displayName(suggestion)}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-sm font-semibold text-brand-700">
                      {displayName(suggestion).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{displayName(suggestion)}</p>
                    <p className="truncate text-xs text-slate-500">@{suggestion.username || 'student'}</p>
                  </div>
                </Link>
                <FollowButton targetId={suggestion.id} initialFollowing={!!suggestion.isFollowing} />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No suggestions right now.</p>
          )}
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Campus trends</h2>
        <div className="mt-4 space-y-3">
          {trends.map((trend) => (
            <div key={trend} className="rounded-2xl bg-brand-50 px-4 py-3">
              <p className="text-sm font-semibold text-brand-800">{trend}</p>
              <p className="mt-1 text-xs text-slate-500">Trending around the Rangsit community</p>
            </div>
          ))}
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Quick stats</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-50 px-3 py-4 text-center">
            <p className="text-lg font-semibold text-slate-950">{stats.posts}</p>
            <p className="mt-1 text-xs text-slate-500">Posts</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-4 text-center">
            <p className="text-lg font-semibold text-slate-950">{stats.followers}</p>
            <p className="mt-1 text-xs text-slate-500">Followers</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-4 text-center">
            <p className="text-lg font-semibold text-slate-950">{stats.following}</p>
            <p className="mt-1 text-xs text-slate-500">Following</p>
          </div>
        </div>
      </Card>

      <Card as="section" className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {activity.map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-800">{item}</p>
              <p className="mt-1 text-xs text-slate-500">Stay aware of movement around your network.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
