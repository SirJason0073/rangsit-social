'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { useAuth } from './Providers';
import Button from './ui/Button';
import { SubtlePanel } from './ui/Card';
import { cn } from '@/utils/cn';

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

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-brand-900 via-brand-800 to-sky-600 shadow-[0_10px_32px_rgba(0,92,153,0.2)] backdrop-blur-2xl">
      <div className="container py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <BrandLogo dark />
            <div className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 md:inline-flex">
              Campus Social
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white/85 lg:hidden"
              aria-label="Open navigation"
            >
              <span className="text-lg">≡</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:ml-8 lg:max-w-4xl lg:flex-row lg:items-center lg:justify-end">
            <div className="hidden lg:flex lg:min-w-[260px] lg:max-w-[360px] lg:flex-1">
              <label className="relative flex w-full items-center">
                <span className="pointer-events-none absolute left-4 text-sm text-white/60">Search</span>
                <input
                  className="w-full rounded-full border border-white/14 bg-white/10 py-2.5 pl-16 pr-4 text-sm text-white placeholder:text-transparent outline-none transition focus:border-white/30 focus:bg-white/14"
                  placeholder="Search people, posts, or topics"
                  aria-label="Search"
                />
              </label>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={pathname === item.href ? 'nav-pill-active' : 'nav-pill'}
                >
                  {item.label}
                </Link>
              ))}
              {user && user.profile_completed ? (
                <Link href="/posts/new" className={pathname === '/posts/new' ? 'nav-pill-active' : 'nav-pill'}>
                  New Post
                </Link>
              ) : null}
            </nav>

            {!loading && !user ? (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="border border-white/18 bg-white/8 text-white hover:bg-white/12">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-brand-900 hover:bg-slate-100">Sign up</Button>
                </Link>
              </div>
            ) : null}

            {!loading && user ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="ghost" className="hidden text-white/80 hover:bg-white/10 hover:text-white md:inline-flex">
                  Notifications
                </Button>
                <Link
                  href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'}
                  className={cn(
                    'flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-2 py-1 pr-4 backdrop-blur transition hover:bg-white/14',
                    pathname.startsWith('/profile') ? 'ring-2 ring-white/16' : ''
                  )}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={displayName(user)}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-white/30 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                      {displayName(user).slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{displayName(user)}</p>
                    <p className="truncate text-xs text-white/70">
                      {user.profile_completed ? `@${user.username || 'student'}` : 'Finish profile'}
                    </p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white/78 hover:bg-white/10 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <SubtlePanel className="border-white/10 bg-white/10 p-3 text-white shadow-none">
            <div className="flex items-center gap-3">
              <label className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/60">
                  Search
                </span>
                <input
                  className="w-full rounded-full border border-white/14 bg-white/10 py-2.5 pl-16 pr-4 text-sm text-white placeholder:text-transparent outline-none transition focus:border-white/30"
                  placeholder="Search"
                  aria-label="Search"
                />
              </label>
              {user ? (
                <Link href="/posts/new">
                  <Button className="px-4">Post</Button>
                </Link>
              ) : null}
            </div>
          </SubtlePanel>
        </div>
      </div>
    </header>
  );
}
