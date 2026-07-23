'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/components/Providers';
import SectionHeader from '@/components/ui/SectionHeader';
import { Panel, SubtlePanel } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser, refresh } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    if (user.profile_completed) {
      const nextPath = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      router.replace(nextPath || '/feed');
    } else {
      router.replace('/onboarding');
    }
  }, [user, loading, router]);

  async function handleLogin(form) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      await refresh();
      const nextPath = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      const destination = data.user.profile_completed ? (nextPath || '/feed') : '/onboarding';

      if (typeof window !== 'undefined') {
        window.location.replace(destination);
        return;
      }

      if (data.user.profile_completed) {
        router.replace(nextPath || '/feed');
      } else {
        router.replace('/onboarding');
      }
      router.refresh();
    } else {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(440px,0.9fr)] lg:items-stretch xl:gap-8">
      <section className="glass-panel overflow-hidden p-0">
        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-brand-strong via-brand to-accent p-8 text-foreground-inverse md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground-inverse/10 to-transparent" />
          <div className="relative flex h-full flex-col">
            <BrandLogo dark />
            <div className="mt-10">
              <SectionHeader
                eyebrow="Modern campus network"
                title="Connect with campus life in one branded social space."
                description="Follow classmates, share updates, join conversations, and keep your student presence active with a product-style experience built for Rangsit University."
                tone="inverse"
              />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SubtlePanel className="border-foreground-inverse/20 bg-foreground-inverse/10 p-4 text-foreground-inverse shadow-none">
                <p className="text-sm font-semibold">Campus feed</p>
                <p className="mt-2 text-xs leading-6 text-foreground-inverse/75">Posts, photos, videos, and updates in one stream.</p>
              </SubtlePanel>
              <SubtlePanel className="border-foreground-inverse/20 bg-foreground-inverse/10 p-4 text-foreground-inverse shadow-none">
                <p className="text-sm font-semibold">Profiles</p>
                <p className="mt-2 text-xs leading-6 text-foreground-inverse/75">Real names, usernames, birthdays, and social stats.</p>
              </SubtlePanel>
              <SubtlePanel className="border-foreground-inverse/20 bg-foreground-inverse/10 p-4 text-foreground-inverse shadow-none">
                <p className="text-sm font-semibold">Connections</p>
                <p className="mt-2 text-xs leading-6 text-foreground-inverse/75">Follow people, explore lists, and stay visible.</p>
              </SubtlePanel>
            </div>

            <Panel className="mt-8 border-foreground-inverse/10 bg-foreground-inverse/10 p-5 text-foreground-inverse shadow-none">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground-inverse/80">Why students use it</p>
                  <p className="mt-3 text-sm leading-7 text-foreground-inverse/80">
                    One place for community updates, identity, social discovery, and campus moments.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-card bg-foreground-inverse/10 px-4 py-3">
                    <p className="text-lg font-semibold">Profiles</p>
                    <p className="mt-1 text-xs text-foreground-inverse/70">Built from onboarding, not fake placeholders.</p>
                  </div>
                  <div className="rounded-card bg-foreground-inverse/10 px-4 py-3">
                    <p className="text-lg font-semibold">Media</p>
                    <p className="mt-1 text-xs text-foreground-inverse/70">Images and video uploads through Cloudinary.</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          footer={
            <p className="text-center text-sm text-foreground-muted">
              New here? <Link href="/signup" className="link font-medium">Create an account</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
