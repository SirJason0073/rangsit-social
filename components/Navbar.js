'use client';

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
  if (!user) return '';
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.username || user.email;
}

const navItems = [
  { href: '/feed', label: 'Feed' },
  { href: '/saved', label: 'Saved' }
];

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useToast();

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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 backdrop-blur-xl">
      <div className="container flex min-h-header items-center justify-between gap-4 py-3">
        <BrandLogo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'nav-pill-active' : 'nav-pill'}>{item.label}</Link>;
          })}
          {user?.profile_completed ? <Link href="/posts/new" aria-current={pathname === '/posts/new' ? 'page' : undefined} className={pathname === '/posts/new' ? 'nav-pill-active' : 'nav-pill'}>Create post</Link> : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && user ? (
            <Dropdown>
              <DropdownTrigger label="Open account menu" className="max-w-[13rem] border border-border bg-surface-elevated">
                <Avatar src={user.avatar} alt={displayName(user)} fallback={displayName(user)} size="sm" />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block truncate text-sm font-semibold text-foreground">{displayName(user)}</span>
                  <span className="block truncate text-xs text-foreground-muted">{user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}</span>
                </span>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownItem onSelect={() => router.push(user.profile_completed ? `/profile/${user.id}` : '/onboarding')}><Icon name="user" />Profile</DropdownItem>
                {user.profile_completed ? <DropdownItem onSelect={() => router.push('/profile/edit')}><Icon name="user" />Edit profile</DropdownItem> : null}
                <DropdownItem onSelect={handleLogout} className="text-danger hover:bg-danger-subtle hover:text-danger"><Icon name="logout" />Log out</DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : null}
        </div>
      </div>
    </header>
  );
}
