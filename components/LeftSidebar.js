'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './Providers';
import ProfileCard from './ProfileCard';
import { Card } from './ui/Card';
import Icon from './ui/Icon';

export default function LeftSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div className="space-y-4">
      <ProfileCard user={user} href={user.profile_completed ? `/profile/${user.id}` : '/onboarding'} />

      <Card as="nav" aria-label="Sidebar navigation" className="p-3">
        {[
          { href: '/feed', label: 'Feed', icon: 'home' },
          { href: '/posts/new', label: 'Create post', icon: 'plus' },
          { href: `/profile/${user.id}`, label: 'My profile', icon: 'user' },
          { href: '/saved', label: 'Saved posts', icon: 'bookmark' },
          ...(!user.profile_completed ? [{ href: '/onboarding', label: 'Complete onboarding', icon: 'check' }] : [])
        ].map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition duration-fast ${active ? 'bg-brand-subtle text-brand-strong' : 'text-foreground-secondary hover:bg-surface-muted hover:text-foreground'}`}><Icon name={item.icon} size="sm" /><span>{item.label}</span></Link>;
        })}
      </Card>
    </div>
  );
}
