'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Card } from './ui/Card';
import Button from './ui/Button';
import { FieldError, FieldHint, FieldLabel, TextInput } from './ui/Field';

export default function RecoveryForm() {
  const emailId = useId();
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter the email address connected to your account.');
      inputRef.current?.focus();
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <Card as="form" onSubmit={handleSubmit} noValidate className="auth-form-card space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Account recovery</p>
        <h1 className="type-h1">Forgot your password?</h1>
        <p className="text-sm leading-6 text-foreground-muted">
          Enter your account email to check the recovery options available for this deployment.
        </p>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-2">
            <FieldLabel htmlFor={emailId}>Email address</FieldLabel>
            <TextInput
              ref={inputRef}
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${emailId}-error` : `${emailId}-hint`}
              required
            />
            <FieldHint id={`${emailId}-hint`}>Use the same email you use to sign in.</FieldHint>
            <FieldError id={`${emailId}-error`}>{error}</FieldError>
          </div>
          <Button type="submit" size="lg" className="w-full">Continue</Button>
        </>
      ) : (
        <div role="status" className="rounded-card border border-warning/30 bg-warning-subtle p-5">
          <p className="font-semibold text-foreground">Recovery email is not enabled</p>
          <p className="mt-2 text-sm leading-6 text-foreground-secondary">
            This deployment does not yet have a password-reset email service. Your password has not been changed.
            Contact the project administrator for account recovery.
          </p>
        </div>
      )}

      <p className="border-t border-border pt-4 text-center text-sm text-foreground-muted">
        Remember your password? <Link href="/login" className="link font-medium">Return to sign in</Link>
      </p>
    </Card>
  );
}
