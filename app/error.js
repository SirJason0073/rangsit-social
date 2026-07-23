'use client';

import ErrorState from '@/components/ui/ErrorState';

export default function GlobalError({ reset }) {
  return (
    <main className="container py-12">
      <ErrorState title="Rangsit Social encountered an error" description="Your data is safe. Try loading the page again." onRetry={reset} />
    </main>
  );
}
