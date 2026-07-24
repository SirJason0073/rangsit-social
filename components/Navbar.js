'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { useAuth } from './Providers';
import Avatar from './ui/Avatar';
import ThemeToggle from './ui/ThemeToggle';
import Icon from './ui/Icon';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './ui/Dropdown';
import { useToast } from './ui/Toast';

function displayName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || user?.email || '';
}

function isActive(pathname, href) {
  if (href === '/feed') return pathname === '/feed';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navItems = [
  { href: '/feed', label: 'Feed', icon: 'home' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/saved', label: 'Saved', icon: 'bookmark' }
];

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (pathname === '/search') {
      setSearchQuery(new URLSearchParams(window.location.search).get('q') || '');
    } else {
      setSearchQuery('');
    }
  }, [pathname]);

  async function handleLogout() {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (!response.ok) {
      notify('Logout failed. Please try again.', { tone: 'danger' });
      return;
    }
    setUser(null);
    router.replace('/login');
    router.refresh();
  }

  function handleSearch(event) {
    event.preventDefault();
    const term = searchQuery.trim();
    router.push(term.length >= 2 ? `/search?q=${encodeURIComponent(term)}` : '/search');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 shadow-1 backdrop-blur">
      <div className="container grid min-h-header grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-3 sm:gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <BrandLogo compactOnMobile />

        <div className="hidden min-w-0 items-center justify-center gap-4 lg:flex">
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'nav-pill-active' : 'nav-pill'}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form role="search" onSubmit={handleSearch} className="relative w-full max-w-md">
            <Icon name="search" size="sm" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search Rangsit Social"
              className="input h-10 min-h-10 bg-surface-muted pl-10"
              aria-label="Search Rangsit Social"
            />
          </form>
        </div>

        <div className="flex items-center justify-end gap-2">
          {user?.profile_completed ? (
            <Link href="/posts/new" className="btn btn-primary hidden xl:inline-flex"><Icon name="plus" size="sm" />New post</Link>
          ) : null}
          <ThemeToggle />
          {user ? <Link href="/notifications" aria-label="Notifications" aria-current={pathname === '/notifications' ? 'page' : undefined} className={`hidden h-11 w-11 items-center justify-center rounded-control transition-colors sm:inline-flex ${pathname === '/notifications' ? 'bg-brand-subtle text-brand-strong' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'}`}><Icon name="bell" /></Link> : null}
          {!loading && user ? (
            <Dropdown>
              <DropdownTrigger label="Open account menu" className="max-w-[13rem] border border-border bg-surface-elevated">
                <Avatar src={user.avatar} alt={displayName(user)} fallback={displayName(user)} size="sm" />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block truncate text-sm font-semibold text-foreground">{displayName(user)}</span>
                  <span className="block truncate text-xs text-foreground-muted">{user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}</span>
                </span>
              </DropdownTrigger>
              <DropdownContent className="mt-1">
                <DropdownItem onSelect={() => router.push(user.profile_completed ? `/profile/${user.id}` : '/onboarding')}><Icon name="user" />Profile</DropdownItem>
                {user.profile_completed ? <DropdownItem onSelect={() => router.push('/profile/edit')}><Icon name="edit" />Edit profile</DropdownItem> : null}
                <DropdownItem onSelect={() => router.push('/saved')}><Icon name="bookmark" />Saved posts</DropdownItem>
                <DropdownItem onSelect={() => router.push('/settings')}><Icon name="settings" />Settings</DropdownItem>
                <div className="my-1 border-t border-border" role="separator" />
                <DropdownItem onSelect={handleLogout} className="text-danger hover:bg-danger-subtle hover:text-danger"><Icon name="logout" />Log out</DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : null}
        </div>
      </div>
    </header>
  );
}
