'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/components/Providers';
import SectionHeader from '@/components/ui/SectionHeader';
import { Panel, SubtlePanel } from '@/components/ui/Card';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.profile_completed ? '/feed' : '/onboarding');
  }, [user, loading, router]);

  async function handleSignup(form) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      throw new Error(data.message || 'Signup failed');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(440px,0.9fr)] lg:items-stretch xl:gap-8">
      <section className="glass-panel overflow-hidden p-0">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-brand-900 to-sky-500 p-8 text-white md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="relative">
            <BrandLogo dark />
            <div className="mt-10">
              <SectionHeader
                eyebrow="Get started"
                title="Create your campus account and build your profile in minutes."
                description="Sign up with your email first. After login, onboarding completes your public profile with your photo, username, bio, and birthday before you enter the feed."
                className="text-white"
              />
            </div>
            <div className="mt-8 grid gap-3">
              {[
                'Step 1: Create your account',
                'Step 2: Log in and complete onboarding',
                'Step 3: Start posting and following people'
              ].map((item) => (
                <SubtlePanel key={item} className="border-white/15 bg-white/10 p-4 text-sm text-white/85 shadow-none">
                  {item}
                </SubtlePanel>
              ))}
            </div>
            <Panel className="mt-8 border-white/10 bg-white/10 p-5 text-white shadow-none">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-2xl font-semibold">1</p>
                  <p className="mt-2 text-sm text-white/75">Simple email-based registration</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">2</p>
                  <p className="mt-2 text-sm text-white/75">Onboarding with profile image and identity</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="mt-2 text-sm text-white/75">Enter a social feed designed for campus life</p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center">
        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          footer={
            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link href="/login" className="link font-medium">Log in</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
