'use client';

import Link from 'next/link';
import { useId, useMemo, useRef, useState } from 'react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { FieldError, FieldHint, FieldLabel, TextInput } from './ui/Field';

export default function AuthForm({ type, onSubmit, footer }) {
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const errorId = useId();
  const firstInvalidRef = useRef(null);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '', form: '' }));
  }

  const passwordStrength = useMemo(() => {
    if (type !== 'signup') return null;
    const value = form.password;
    const checks = [
      value.length >= 8,
      /[a-z]/.test(value) && /[A-Z]/.test(value),
      /\d/.test(value),
      /[^a-zA-Z0-9]/.test(value)
    ];
    const score = checks.filter(Boolean).length;
    if (!value) return { label: 'Not entered', tone: 'bg-surface-muted', width: '0%' };
    if (score <= 1) return { label: 'Weak', tone: 'bg-danger', width: '25%' };
    if (score === 2) return { label: 'Fair', tone: 'bg-warning', width: '50%' };
    if (score === 3) return { label: 'Good', tone: 'bg-brand', width: '75%' };
    return { label: 'Strong', tone: 'bg-success', width: '100%' };
  }, [form.password, type]);

  function validateForm() {
    const nextErrors = {};
    const email = form.email.trim();
    if (!email) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Enter your password.';
    else if (type === 'signup' && form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    if (type === 'signup' && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      requestAnimationFrame(() => firstInvalidRef.current?.focus());
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await onSubmit({ email: form.email.trim().toLowerCase(), password: form.password });
    } catch (error) {
      setErrors({ form: error.message || 'We could not complete your request. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} noValidate className="auth-form-card space-y-6" aria-describedby={errors.form ? errorId : undefined}>
      <div className="space-y-2">
        <h1 className="type-h1 text-foreground">
          {type === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm leading-6 text-foreground-muted">
          {type === 'signup'
            ? 'Join Rangsit Social with your email. You will create your public profile next.'
            : 'Sign in to continue to your campus community.'}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <FieldLabel htmlFor={emailId}>Email address</FieldLabel>
          <TextInput
            ref={!form.email && errors.email ? firstInvalidRef : undefined}
            id={emailId}
            name="email"
            className="h-12"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            disabled={loading}
            required
          />
          <FieldError id={`${emailId}-error`}>{errors.email}</FieldError>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <div className="relative">
            <TextInput
              ref={errors.password && !errors.email ? firstInvalidRef : undefined}
              className="h-12 pr-16"
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={type === 'signup' ? 'new-password' : 'current-password'}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder={type === 'signup' ? 'Create a secure password' : 'Enter your password'}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 min-h-9 -translate-y-1/2 rounded-control px-2 text-xs font-semibold text-foreground-muted transition hover:bg-surface-muted hover:text-foreground"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <FieldError id={`${passwordId}-error`}>{errors.password}</FieldError>
          {passwordStrength ? (
            <div className="space-y-2">
              <div
                className="h-1.5 overflow-hidden rounded-full bg-surface-muted"
                role="meter"
                aria-label="Password strength"
                aria-valuemin="0"
                aria-valuemax="4"
                aria-valuenow={Math.round(parseInt(passwordStrength.width, 10) / 25)}
              >
                <div className={`h-full rounded-full transition-all ${passwordStrength.tone}`} style={{ width: passwordStrength.width }} />
              </div>
              <FieldHint>Password strength: {passwordStrength.label}. Use upper and lowercase letters, a number, and a symbol.</FieldHint>
            </div>
          ) : null}
        </div>

        {type === 'signup' ? (
          <div className="space-y-2">
            <FieldLabel htmlFor={confirmPasswordId}>Confirm password</FieldLabel>
            <TextInput
              ref={errors.confirmPassword && !errors.email && !errors.password ? firstInvalidRef : undefined}
              id={confirmPasswordId}
              name="confirmPassword"
              className="h-12"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? `${confirmPasswordId}-error` : undefined}
              disabled={loading}
              required
            />
            <FieldError id={`${confirmPasswordId}-error`}>{errors.confirmPassword}</FieldError>
          </div>
        ) : null}
      </div>

      {type === 'login' ? (
        <div className="flex justify-end">
          <Link href="/forgot-password" className="link text-sm font-medium">Forgot password?</Link>
        </div>
      ) : null}

      {errors.form ? (
        <div id={errorId} role="alert" aria-live="assertive" className="rounded-control border border-danger/30 bg-danger-subtle p-4 text-sm text-danger">
          {errors.form}
        </div>
      ) : null}

      <Button type="submit" className="h-12 w-full text-base" loading={loading} loadingLabel={type === 'signup' ? 'Creating account' : 'Signing in'}>
        {type === 'signup' ? 'Create account' : 'Sign in'}
      </Button>

      {footer ? <div className="border-t border-border pt-4">{footer}</div> : null}
    </Card>
  );
}
