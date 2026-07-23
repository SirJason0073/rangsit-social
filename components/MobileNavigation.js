'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './Providers';
import Icon from './ui/Icon';

export default function MobileNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const items = [
    { href: '/feed', label: 'Feed', icon: 'home', active: pathname === '/feed' },
    { href: '/saved', label: 'Saved', icon: 'bookmark', active: pathname === '/saved' },
    ...(user.profile_completed ? [{ href: '/posts/new', label: 'Create', icon: 'plus', active: pathname.startsWith('/posts/new') }] : []),
    { href: user.profile_completed ? `/profile/${user.id}` : '/onboarding', label: 'Profile', icon: 'user', active: pathname.startsWith('/profile') || pathname === '/onboarding' }
  ];

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-elevated/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-flow-col auto-cols-fr">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-control px-2 text-xs font-semibold transition duration-fast ${item.active ? 'bg-brand-subtle text-brand-strong' : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'}`}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
