'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from './PostCard';
import UserListItem from './UserListItem';
import Button from './ui/Button';
import { Card } from './ui/Card';
import EmptyState from './ui/EmptyState';
import ErrorState from './ui/ErrorState';
import Icon from './ui/Icon';
import { Skeleton, SkeletonAvatar } from './ui/Skeleton';
import Tabs from './ui/Tabs';

const RECENT_SEARCH_KEY = 'rangsit-recent-searches';
const CAMPUS_TOPICS = ['campus event', 'study group', 'student club', 'internship', 'Rangsit'];

function ResultsSkeleton() {
  return (
    <div className="space-y-3" aria-label="Searching">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="flex items-center gap-3 p-4">
          <SkeletonAvatar />
          <div className="flex-1"><Skeleton className="h-3 w-32" /><Skeleton className="mt-2 h-3 w-48" /></div>
        </Card>
      ))}
    </div>
  );
}

export default function SearchExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = (searchParams.get('q') || '').trim();
  const urlType = searchParams.get('type') || 'all';
  const initialType = urlType;
  const inputRef = useRef(null);
  const [input, setInput] = useState(urlQuery);
  const [activeType, setActiveType] = useState(['all', 'people', 'posts', 'campus'].includes(initialType) ? initialType : 'all');
  const [results, setResults] = useState({ users: [], posts: [], pagination: {} });
  const [suggestions, setSuggestions] = useState({ users: [], posts: [] });
  const [discoveryUsers, setDiscoveryUsers] = useState([]);
  const [loadingDiscovery, setLoadingDiscovery] = useState(true);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const suggestionItems = useMemo(() => [
    ...suggestions.users.map((user) => ({ id: `user-${user.id}`, kind: 'user', value: user })),
    ...suggestions.posts.map((post) => ({ id: `post-${post.id}`, kind: 'post', value: post }))
  ], [suggestions]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_SEARCH_KEY) || '[]');
      setRecent(Array.isArray(stored) ? stored.slice(0, 6) : []);
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDiscovery() {
      try {
        const response = await fetch('/api/users/suggestions?limit=24', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        setDiscoveryUsers(data.users || []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setDiscoveryUsers([]);
      } finally {
        if (!controller.signal.aborted) setLoadingDiscovery(false);
      }
    }
    loadDiscovery();
    return () => controller.abort();
  }, []);

  const saveRecent = useCallback((term) => {
    const cleanTerm = term.trim();
    if (cleanTerm.length < 2) return;
    setRecent((current) => {
      const next = [cleanTerm, ...current.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
      } catch {
        // Search remains usable when browser storage is unavailable.
      }
      return next;
    });
  }, []);

  const runSearch = useCallback(async (term, nextPage = 1, append = false) => {
    if (term.trim().length < 2) {
      setResults({ users: [], posts: [], pagination: {} });
      return;
    }
    append ? setLoadingMore(true) : setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}&page=${nextPage}&limit=8`, {
        cache: 'no-store',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Search could not be completed.');
      setResults((current) => ({
        users: append ? [...current.users, ...(data.users || [])] : (data.users || []),
        posts: append ? [...current.posts, ...(data.posts || [])] : (data.posts || []),
        pagination: data.pagination || {}
      }));
      setPage(nextPage);
      saveRecent(term);
    } catch (requestError) {
      setError(requestError.message || 'Search could not be completed.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [saveRecent]);

  useEffect(() => {
    setInput(urlQuery);
    setPage(1);
    if (urlQuery) runSearch(urlQuery, 1, false);
    else setResults({ users: [], posts: [], pagination: {} });
  }, [runSearch, urlQuery]);

  useEffect(() => {
    setActiveType(['all', 'people', 'posts', 'campus'].includes(urlType) ? urlType : 'all');
  }, [urlType]);

  useEffect(() => {
    const term = input.trim();
    if (!focused || term.length < 2 || term === urlQuery) {
      setSuggestions({ users: [], posts: [] });
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&page=1&limit=4`, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        setSuggestions({ users: data.users || [], posts: data.posts || [] });
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setSuggestions({ users: [], posts: [] });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [focused, input, urlQuery]);

  useEffect(() => { setActiveSuggestion(-1); }, [suggestions]);

  function navigateToSearch(term, type = activeType) {
    const cleanTerm = term.trim();
    if (cleanTerm.length < 2) return;
    setFocused(false);
    router.push(`/search?q=${encodeURIComponent(cleanTerm)}&type=${type}`);
  }

  function submitSearch(event) {
    event.preventDefault();
    if (input.trim().length < 2) {
      setError('Enter at least two characters to search.');
      inputRef.current?.focus();
      return;
    }
    navigateToSearch(input);
  }

  function openSuggestion(item) {
    setFocused(false);
    if (item.kind === 'user') router.push(`/profile/${item.value.id}`);
    else router.push(`/posts/${item.value.id}`);
  }

  function handleSearchKeyDown(event) {
    if (!suggestionOpen || !suggestionItems.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % suggestionItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((current) => (current - 1 + suggestionItems.length) % suggestionItems.length);
    } else if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      openSuggestion(suggestionItems[activeSuggestion]);
    } else if (event.key === 'Escape') {
      setFocused(false);
    }
  }

  function clearRecent() {
    try {
      localStorage.removeItem(RECENT_SEARCH_KEY);
    } catch {
      // The in-memory list can still be cleared.
    }
    setRecent([]);
  }

  const userCount = Number(results.pagination?.userTotal) || 0;
  const postCount = Number(results.pagination?.postTotal) || 0;
  const hasResults = results.users.length || results.posts.length;
  const suggestionOpen = focused && input.trim().length >= 2 && input.trim() !== urlQuery && (suggestions.users.length || suggestions.posts.length);

  const peopleContent = results.users.length ? (
    <div className="grid gap-3 md:grid-cols-2">
      {results.users.map((user) => <UserListItem key={user.id} user={user} />)}
    </div>
  ) : <EmptyState icon={<Icon name="users" />} title="No people found" description="Try a name, username, or interest from a profile bio." />;

  const postsContent = results.posts.length ? (
    <div className="space-y-4">
      {results.posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  ) : <EmptyState icon={<Icon name="search" />} title="No posts found" description="Try a broader word or another campus topic." />;

  const allContent = hasResults ? (
    <div className="space-y-8">
      {results.users.length ? <section><h2 className="mb-3 text-sm font-semibold text-foreground">People <span className="text-foreground-muted">· {userCount}</span></h2>{peopleContent}</section> : null}
      {results.posts.length ? <section><h2 className="mb-3 text-sm font-semibold text-foreground">Posts <span className="text-foreground-muted">· {postCount}</span></h2>{postsContent}</section> : null}
    </div>
  ) : <EmptyState icon={<Icon name="search" />} title="No results" description={`Nothing matched “${urlQuery}”. Try another name, phrase, or campus topic.`} />;

  const campusContent = (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="font-semibold text-foreground">Campus topics</h2>
        <p className="mt-1 text-sm text-foreground-muted">These are search shortcuts, not claimed trending data.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CAMPUS_TOPICS.map((topic) => <button key={topic} type="button" onClick={() => navigateToSearch(topic, 'campus')} className="badge hover:bg-brand hover:text-foreground-inverse">{topic}</button>)}
        </div>
      </Card>
      {urlQuery ? postsContent : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Discover</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Search Rangsit Social</h1>
        <p className="mt-1 text-sm text-foreground-muted">Find students and search the words shared in campus posts.</p>
      </div>

      <div className="relative">
        <form onSubmit={submitSearch} role="search" className="flex gap-2">
          <div className="relative flex-1">
            <Icon name="search" size="sm" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              ref={inputRef}
              type="search"
              value={input}
              onChange={(event) => { setInput(event.target.value); setError(''); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search people and posts"
              autoComplete="off"
              className="input h-12 pl-11"
              aria-label="Search people and posts"
              aria-expanded={Boolean(suggestionOpen)}
              aria-controls="search-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={activeSuggestion >= 0 ? `search-suggestion-${suggestionItems[activeSuggestion]?.id}` : undefined}
            />
          </div>
          <Button type="submit" size="lg">Search</Button>
        </form>

        {suggestionOpen ? (
          <Card id="search-suggestions" className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(24rem,60dvh)] overflow-y-auto overscroll-contain p-2 shadow-3" role="listbox" aria-label="Search suggestions">
            {suggestionItems.map((item, index) => {
              const selected = activeSuggestion === index;
              const user = item.kind === 'user' ? item.value : null;
              return <button id={`search-suggestion-${item.id}`} key={item.id} type="button" role="option" aria-selected={selected} onMouseEnter={() => setActiveSuggestion(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => openSuggestion(item)} className={`flex min-h-11 w-full items-center gap-3 rounded-control px-3 py-2 text-left ${selected ? 'bg-brand-subtle' : 'hover:bg-surface-muted'}`}>
                <Icon name={item.kind === 'user' ? 'user' : 'comment'} size="sm" className="shrink-0 text-foreground-muted" />
                {user ? <span className="min-w-0"><span className="block truncate text-sm font-medium text-foreground">{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}</span><span className="block truncate text-xs text-foreground-muted">@{user.username || 'student'}</span></span> : <span className="line-clamp-2 text-sm text-foreground-secondary">{item.value.content}</span>}
              </button>;
            })}
          </Card>
        ) : null}
      </div>

      {error ? <div role="alert" className="rounded-control border border-danger/30 bg-danger-subtle p-4 text-sm text-danger">{error}</div> : null}

      {!urlQuery && activeType === 'people' ? (
        <section className="space-y-4" aria-labelledby="people-discovery-title">
          <div>
            <h2 id="people-discovery-title" className="text-lg font-semibold text-foreground">People to discover</h2>
            <p className="mt-1 text-sm text-foreground-muted">Suggestions based on profiles you are not currently following.</p>
          </div>
          {loadingDiscovery ? <ResultsSkeleton /> : discoveryUsers.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {discoveryUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  onFollowChange={(following) => {
                    if (following) {
                      setDiscoveryUsers((current) => current.filter((item) => String(item.id) !== String(user.id)));
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Icon name="users" />} title="No suggestions right now" description="Search by name or username to find another student." />
          )}
        </section>
      ) : !urlQuery && activeType === 'campus' ? campusContent : !urlQuery ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-foreground">Recent searches</h2>
              {recent.length ? <button type="button" onClick={clearRecent} className="text-xs font-medium text-foreground-muted hover:text-danger">Clear</button> : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {recent.length
                ? recent.map((term) => <button key={term} type="button" onClick={() => navigateToSearch(term)} className="metric-link"><Icon name="history" size="sm" />{term}</button>)
                : <p className="text-sm text-foreground-muted">Your searches are stored only in this browser.</p>}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold text-foreground">Explore campus</h2>
            <p className="mt-1 text-sm text-foreground-muted">Start with a useful topic.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CAMPUS_TOPICS.slice(0, 4).map((topic) => <button key={topic} type="button" onClick={() => navigateToSearch(topic, 'campus')} className="metric-link">{topic}</button>)}
            </div>
          </Card>
        </div>
      ) : loading ? <ResultsSkeleton /> : error && !hasResults ? (
        <ErrorState title="Search unavailable" description={error} onRetry={() => runSearch(urlQuery, 1, false)} />
      ) : (
        <>
          <Tabs
            value={activeType}
            onValueChange={(type) => {
              setActiveType(type);
              router.replace(`/search?q=${encodeURIComponent(urlQuery)}&type=${type}`, { scroll: false });
            }}
            label="Search result types"
            items={[
              { id: 'all', label: `All (${userCount + postCount})`, content: allContent },
              { id: 'people', label: `People (${userCount})`, content: peopleContent },
              { id: 'posts', label: `Posts (${postCount})`, content: postsContent },
              { id: 'campus', label: 'Campus', content: campusContent }
            ]}
          />
          {results.pagination?.hasMore ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => runSearch(urlQuery, page + 1, true)} loading={loadingMore} loadingLabel="Loading results">Load more results</Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
