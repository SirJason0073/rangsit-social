'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from './ui/Button';
import { Card, SubtlePanel } from './ui/Card';
import { FieldHint, FieldLabel, TextInput } from './ui/Field';

export default function AuthForm({ type, onSubmit, footer }) {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const rememberId = useId();
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
    if (!value) return { label: 'Add a password', tone: 'bg-surface-muted', width: 'w-1/4' };
    if (value.length < 6) return { label: 'Weak', tone: 'bg-danger', width: 'w-1/4' };
    if (value.length < 10) return { label: 'Medium', tone: 'bg-warning', width: 'w-2/4' };
    return { label: 'Strong', tone: 'bg-success', width: 'w-full' };
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
        <h1 className="type-h1 text-foreground">
          {type === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm leading-6 text-foreground-muted">
          {type === 'signup'
            ? 'Start with your account, then finish onboarding to join the campus network.'
            : 'Log in to continue posting, following, and connecting across Rangsit Social.'}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
          <TextInput
            id={emailId}
            name="email"
            className="h-12"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="student@rangsit.edu"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          </div>
          <div className="relative">
            <TextInput
              className="h-12 pr-12"
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={type === 'signup' ? 'new-password' : 'current-password'}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder={type === 'signup' ? 'Create a secure password' : 'Enter your password'}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-foreground-muted transition hover:bg-surface-muted hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordStrength ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-surface-muted">
                <div className={`h-2 rounded-full transition-all ${passwordStrength.tone} ${passwordStrength.width}`} />
              </div>
              <FieldHint>Password strength: {passwordStrength.label}</FieldHint>
            </div>
          ) : null}
        </div>
      </div>

      {type === 'login' ? <div className="flex items-center justify-between gap-4 text-sm">
        <label htmlFor={rememberId} className="inline-flex items-center gap-2 text-foreground-secondary">
          <input
            id={rememberId}
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-brand-700 focus:ring-brand-300"
          />
          Remember me
        </label>
        <FieldHint>Keep this session available on this device.</FieldHint>
      </div> : null}

      {error ? (
        <SubtlePanel id={errorId} role="alert" aria-live="polite" className="border-danger/30 bg-danger-subtle p-4 text-sm text-danger">
          {error}
        </SubtlePanel>
      ) : null}

      <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
        {loading ? 'Please wait...' : type === 'signup' ? 'Sign up' : 'Log in'}
      </Button>

      {footer ? <div className="border-t border-border pt-4">{footer}</div> : null}
    </Card>
  );
}
