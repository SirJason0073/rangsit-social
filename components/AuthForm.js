'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Button from './ui/Button';
import { Card, SubtlePanel } from './ui/Card';
import { FieldHint, FieldLabel, TextInput } from './ui/Field';

export default function AuthForm({ type, onSubmit, footer }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(type === 'login');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const passwordStrength = useMemo(() => {
    if (type !== 'signup') return null;
    const value = form.password;
    if (!value) return { label: 'Add a password', tone: 'bg-slate-200', width: 'w-1/4' };
    if (value.length < 6) return { label: 'Weak', tone: 'bg-rose-400', width: 'w-1/4' };
    if (value.length < 10) return { label: 'Medium', tone: 'bg-amber-400', width: 'w-2/4' };
    return { label: 'Strong', tone: 'bg-emerald-500', width: 'w-full' };
  }, [form.password, type]);

  function validateForm() {
    const email = form.email.trim();
    if (!email) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ email: form.email.trim(), password: form.password, rememberMe });
    } catch (err) {
      setError(err.message || 'Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          {type === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          {type === 'signup'
            ? 'Start with your account, then finish onboarding to join the campus network.'
            : 'Log in to continue posting, following, and connecting across Rangsit Social.'}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <TextInput
            className="h-12"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="student@rangsit.edu"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel>Password</FieldLabel>
            {type === 'login' ? (
              <Link href="/login" className="text-xs font-medium text-brand-700 hover:text-brand-800">
                Forgot password?
              </Link>
            ) : null}
          </div>
          <div className="relative">
            <TextInput
              className="h-12 pr-12"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder={type === 'signup' ? 'Create a secure password' : 'Enter your password'}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordStrength ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-2 rounded-full transition-all ${passwordStrength.tone} ${passwordStrength.width}`} />
              </div>
              <FieldHint>Password strength: {passwordStrength.label}</FieldHint>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="inline-flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-300"
          />
          Remember me
        </label>
        <FieldHint>{type === 'signup' ? 'Email verification can be added later.' : 'Secure session on this device.'}</FieldHint>
      </div>

      {error ? (
        <SubtlePanel className="border-rose-100 bg-rose-50/85 p-4 text-sm text-rose-600">
          {error}
        </SubtlePanel>
      ) : null}

      <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
        {loading ? 'Please wait...' : type === 'signup' ? 'Sign up' : 'Log in'}
      </Button>

      {footer ? <div className="border-t border-slate-100 pt-4">{footer}</div> : null}
    </Card>
  );
}
