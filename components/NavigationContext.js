'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './Providers';
import Icon from './ui/Icon';

function buildCrumbs(pathname, user) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length || ['/feed', '/search', '/saved'].includes(pathname)) return [];

  if (pathname === '/notifications') return [{ label: 'Feed', href: '/feed' }, { label: 'Notifications' }];
  if (pathname === '/settings') return [{ label: 'Feed', href: '/feed' }, { label: 'Settings' }];

  if (segments[0] === 'posts') {
    if (segments[1] === 'new') return [{ label: 'Feed', href: '/feed' }, { label: 'New post' }];
    const crumbs = [{ label: 'Feed', href: '/feed' }, { label: 'Post', href: `/posts/${segments[1]}` }];
    if (segments[2] === 'edit') crumbs.push({ label: 'Edit' });
    else crumbs[crumbs.length - 1].href = undefined;
    return crumbs;
  }

  if (segments[0] === 'profile') {
    const profileId = segments[1] === 'edit' ? user?.id : segments[1];
    const crumbs = [{ label: 'Feed', href: '/feed' }, { label: 'Profile', href: profileId ? `/profile/${profileId}` : '/feed' }];
    if (segments[1] === 'edit') crumbs.push({ label: 'Edit' });
    else if (segments[2] === 'followers') crumbs.push({ label: 'Followers' });
    else if (segments[2] === 'following') crumbs.push({ label: 'Following' });
    else crumbs[crumbs.length - 1].href = undefined;
    return crumbs;
  }

  if (pathname === '/onboarding') return [{ label: 'Account', href: '/feed' }, { label: 'Profile setup' }];
  return [];
}

export default function NavigationContext() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const crumbs = buildCrumbs(pathname, user);
  if (!crumbs.length) return null;

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push('/feed');
  }

  return (
    <div className="mb-4 flex min-h-10 items-center gap-3">
      <button type="button" onClick={goBack} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-foreground-muted hover:bg-surface-muted hover:text-foreground" aria-label="Go back">
        <Icon name="arrowLeft" size="sm" />
      </button>
      <nav aria-label="Breadcrumb" className="min-w-0 overflow-x-auto">
        <ol className="flex items-center gap-2 whitespace-nowrap text-sm">
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index ? <span aria-hidden="true" className="text-foreground-muted">/</span> : null}
              {crumb.href ? <Link href={crumb.href} className="text-foreground-muted hover:text-foreground">{crumb.label}</Link> : <span aria-current="page" className="font-medium text-foreground">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
