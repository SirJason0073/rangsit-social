'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import AuthHero from '@/components/AuthHero';
import { useAuth } from '@/components/Providers';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.profile_completed ? '/feed' : '/onboarding');
  }, [user, loading, router]);

  async function handleSignup(form) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'We could not create your account. Try again.');
    }

    router.push('/login');
  }

  return (
    <div className="auth-layout">
      <div className="order-2 lg:order-1"><AuthHero mode="signup" /></div>
      <div className="order-1 flex items-center justify-center lg:order-2">
        <AuthForm
          type="signup"
          onSubmit={handleSignup}
          footer={
            <p className="text-center text-sm text-foreground-muted">
              Already have an account? <Link href="/login" className="link font-medium">Sign in</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
