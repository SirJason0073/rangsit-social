import Link from 'next/link';
import { Card } from './ui/Card';

export default function AccountAccessNotice({ eyebrow, title, description, actionLabel = 'Return to sign in' }) {
  return (
    <Card className="auth-form-card space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
        <h1 className="type-h1">{title}</h1>
        <p className="text-sm leading-6 text-foreground-muted">{description}</p>
      </div>
      <div role="status" className="rounded-card border border-warning/30 bg-warning-subtle p-5">
        <p className="font-semibold text-foreground">Service not configured</p>
        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          This deployment does not include an email delivery service. No account data has been changed.
        </p>
      </div>
      <Link href="/login" className="btn btn-primary min-h-12 w-full">{actionLabel}</Link>
    </Card>
  );
}
