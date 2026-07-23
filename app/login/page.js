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
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-sky-500 p-8 text-white md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_20%)]" />
          <div className="relative">
            <BrandLogo dark />
            <div className="mt-10">
              <SectionHeader
                eyebrow="Modern campus network"
                title="Connect with campus life in one branded social space."
                description="Follow classmates, share updates, join conversations, and keep your student presence active with a product-style experience built for Rangsit University."
                className="text-white"
              />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SubtlePanel className="border-white/15 bg-white/10 p-4 text-white shadow-none">
                <p className="text-sm font-semibold">Campus feed</p>
                <p className="mt-2 text-xs leading-6 text-white/75">Posts, photos, videos, and updates in one stream.</p>
              </SubtlePanel>
              <SubtlePanel className="border-white/15 bg-white/10 p-4 text-white shadow-none">
                <p className="text-sm font-semibold">Profiles</p>
                <p className="mt-2 text-xs leading-6 text-white/75">Real names, usernames, birthdays, and social stats.</p>
              </SubtlePanel>
              <SubtlePanel className="border-white/15 bg-white/10 p-4 text-white shadow-none">
                <p className="text-sm font-semibold">Connections</p>
                <p className="mt-2 text-xs leading-6 text-white/75">Follow people, explore lists, and stay visible.</p>
              </SubtlePanel>
            </div>

            <Panel className="mt-8 border-white/10 bg-white/10 p-5 text-white shadow-none">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Why students use it</p>
                  <p className="mt-3 text-sm leading-7 text-white/80">
                    One place for community updates, identity, social discovery, and campus moments.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-lg font-semibold">Profiles</p>
                    <p className="mt-1 text-xs text-white/70">Built from onboarding, not fake placeholders.</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-lg font-semibold">Media</p>
                    <p className="mt-1 text-xs text-white/70">Images and video uploads through Cloudinary.</p>
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
            <p className="text-center text-sm text-slate-500">
              New here? <Link href="/signup" className="link font-medium">Create an account</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
