'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import AuthHero from '@/components/AuthHero';
import { useAuth } from '@/components/Providers';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.profile_completed ? '/feed' : '/onboarding');
  }, [user, loading, router]);

  async function handleLogin(form) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'We could not sign you in. Check your email and password.');
    }

    setUser(data.user);
    const nextPath = new URLSearchParams(window.location.search).get('next');
    const destination = data.user.profile_completed ? (nextPath || '/feed') : '/onboarding';
    window.location.replace(destination);
  }

  return (
    <div className="auth-layout">
      <div className="order-2 lg:order-1"><AuthHero mode="login" /></div>
      <div className="order-1 flex items-center justify-center lg:order-2">
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          footer={
            <p className="text-center text-sm text-foreground-muted">
              New to Rangsit Social? <Link href="/signup" className="link font-medium">Create an account</Link>
            </p>
          }
        />
      </div>
    </div>
  );
}
