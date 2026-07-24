'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './Providers';
import Icon from './ui/Icon';

function routeIsActive(pathname, href) {
  if (href === '/feed') return pathname === '/feed';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const profileHref = user.profile_completed ? `/profile/${user.id}` : '/onboarding';
  const items = [
    { href: '/feed', label: 'Feed', icon: 'home' },
    { href: '/search', label: 'Search', icon: 'search' },
    ...(user.profile_completed ? [{ href: '/posts/new', label: 'Create', icon: 'plus', primary: true }] : []),
    { href: '/notifications', label: 'Activity', icon: 'bell' },
    { href: profileHref, label: 'Profile', icon: 'user', profile: true }
  ];

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-elevated/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-flow-col auto-cols-fr">
        {items.map((item) => {
          const active = item.profile
            ? pathname.startsWith('/profile') || pathname === '/onboarding'
            : routeIsActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-control px-1 text-[11px] font-semibold transition duration-fast ${
                active ? 'text-brand-strong' : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              {item.primary ? <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-brand-strong text-foreground-inverse' : 'bg-brand text-foreground-inverse shadow-1'}`}><Icon name={item.icon} /></span> : <Icon name={item.icon} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
