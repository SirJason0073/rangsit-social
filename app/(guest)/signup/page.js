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
        <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-brand-strong via-brand to-accent p-8 text-foreground-inverse md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground-inverse/10 to-transparent" />
          <div className="relative flex h-full flex-col">
            <BrandLogo dark />
            <div className="mt-10">
              <SectionHeader
                eyebrow="Get started"
                title="Create your campus account and build your profile in minutes."
                description="Sign up with your email first. After login, onboarding completes your public profile with your photo, username, bio, and birthday before you enter the feed."
                tone="inverse"
              />
            </div>
            <div className="mt-8 grid gap-3">
              {[
                'Step 1: Create your account',
                'Step 2: Log in and complete onboarding',
                'Step 3: Start posting and following people'
              ].map((item) => (
                <SubtlePanel key={item} className="border-foreground-inverse/20 bg-foreground-inverse/10 p-4 text-sm text-foreground-inverse/80 shadow-none">
                  {item}
                </SubtlePanel>
              ))}
            </div>
            <Panel className="mt-8 border-foreground-inverse/10 bg-foreground-inverse/10 p-5 text-foreground-inverse shadow-none">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-2xl font-semibold">1</p>
                  <p className="mt-2 text-sm text-foreground-inverse/75">Simple email-based registration</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">2</p>
                  <p className="mt-2 text-sm text-foreground-inverse/75">Onboarding with profile image and identity</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="mt-2 text-sm text-foreground-inverse/75">Enter a social feed designed for campus life</p>
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
            <p className="text-center text-sm text-foreground-muted">
              Already have an account? <Link href="/login" className="link font-medium">Log in</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
