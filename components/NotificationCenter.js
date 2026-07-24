'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './Providers';
import Avatar from './ui/Avatar';
import Icon from './ui/Icon';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'comment', label: 'Comments' },
  { id: 'like', label: 'Likes' },
  { id: 'follow', label: 'Follows' }
];

function personName(item) {
  return [item.first_name, item.last_name].filter(Boolean).join(' ') || item.username || 'A Rangsit student';
}

function messageFor(item) {
  if (item.type === 'like') return 'liked your post';
  if (item.type === 'comment') return 'commented on your post';
  return 'started following you';
}

function relativeTime(value) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function groupLabel(value) {
  const age = Date.now() - new Date(value).getTime();
  if (age < 86400000) return 'Today';
  if (age < 604800000) return 'This week';
  return 'Earlier';
}

function NotificationSkeleton() {
  return <Card className="space-y-1 overflow-hidden">{[1, 2, 3, 4].map((item) => <div key={item} className="flex gap-3 border-b border-border p-4 last:border-0"><Skeleton className="h-11 w-11 rounded-full" /><div className="flex-1"><Skeleton className="h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-1/3" /></div></div>)}</Card>;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const storageKey = user?.id ? `rangsit-notifications-read-${user.id}` : '';

  async function loadNotifications() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to load notifications.');
      setItems(data.notifications || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadNotifications(); }, []);
  useEffect(() => {
    if (!storageKey) return;
    try { setReadIds(JSON.parse(window.localStorage.getItem(storageKey) || '[]')); } catch { setReadIds([]); }
  }, [storageKey]);

  function persistRead(next) {
    setReadIds(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function markRead(id) {
    if (!readIds.includes(id)) persistRead([...readIds, id]);
  }

  const visible = useMemo(() => items.filter((item) => {
    if (filter === 'unread') return !readIds.includes(item.id);
    return filter === 'all' || item.type === filter;
  }), [filter, items, readIds]);
  const unreadCount = items.filter((item) => !readIds.includes(item.id)).length;
  const grouped = useMemo(() => visible.reduce((groups, item) => {
    const label = groupLabel(item.created_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {}), [visible]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-brand-strong">Activity</p><h1 className="type-h1">Notifications</h1><p className="mt-1 text-sm text-foreground-secondary">Likes, comments, and new connections in one place.</p></div>
        {unreadCount ? <Button variant="outline" size="sm" onClick={() => persistRead(items.map((item) => item.id))}><Icon name="check" size="sm" />Mark all read</Button> : null}
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Notification filters">
        {filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={filter === item.id ? 'nav-pill-active whitespace-nowrap' : 'nav-pill whitespace-nowrap'}>{item.label}{item.id === 'unread' && unreadCount ? ` (${unreadCount})` : ''}</button>)}
      </div>

      {loading ? <NotificationSkeleton /> : error ? (
        <EmptyState icon={<Icon name="alert" />} title="Notifications could not load" description={error} action={<Button onClick={loadNotifications}>Try again</Button>} />
      ) : !visible.length ? (
        <EmptyState icon={<Icon name="bell" />} title={filter === 'unread' ? 'You are all caught up' : 'No activity yet'} description={filter === 'unread' ? 'There are no unread notifications on this device.' : 'New likes, comments, and follows will appear here.'} />
      ) : (
        <Card className="overflow-hidden">
          {Object.entries(grouped).map(([group, groupItems]) => <section key={group} aria-labelledby={`notification-group-${group.replace(/\s/g, '-').toLowerCase()}`}>
            <h2 id={`notification-group-${group.replace(/\s/g, '-').toLowerCase()}`} className="border-b border-border bg-surface-muted px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">{group}</h2>
            <ul aria-label={`${group} notifications`}>
            {groupItems.map((item) => {
              const unread = !readIds.includes(item.id);
              const href = item.post_id ? `/posts/${item.post_id}` : `/profile/${item.actor_id}`;
              return (
                <li key={item.id} className="border-b border-border last:border-0">
                  <Link href={href} onClick={() => markRead(item.id)} className={`notification-enter group grid grid-cols-[auto_1fr_auto] gap-3 p-4 transition-colors hover:bg-surface-muted ${unread ? 'bg-brand-subtle/45' : ''}`}>
                    <div className="relative"><Avatar src={item.avatar} fallback={personName(item)} alt={personName(item)} size="md" /><span className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface-elevated ${item.type === 'like' ? 'bg-danger-subtle text-danger' : item.type === 'comment' ? 'bg-brand-subtle text-brand-strong' : 'bg-success-subtle text-success'}`}><Icon name={item.type === 'like' ? 'heart' : item.type === 'comment' ? 'comment' : 'userPlus'} size="sm" /></span></div>
                    <div className="min-w-0"><p className="text-sm text-foreground-secondary"><strong className="font-semibold text-foreground">{personName(item)}</strong> {messageFor(item)}</p>{item.comment_content ? <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">“{item.comment_content}”</p> : item.post_content ? <p className="mt-1 truncate text-sm text-foreground-muted">{item.post_content}</p> : null}<time className="mt-1 block text-xs text-foreground-muted" dateTime={new Date(item.created_at).toISOString()}>{relativeTime(item.created_at)}</time></div>
                    <span className="flex w-4 items-center justify-center"><span className="sr-only">{unread ? 'Unread notification' : 'Read notification'}</span>{unread ? <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}</span>
                  </Link>
                </li>
              );
            })}
            </ul>
          </section>)}
        </Card>
      )}
      <p className="text-center text-xs text-foreground-muted">Read status is saved on this device. Notification activity comes from your existing posts and connections.</p>
    </div>
  );
}
