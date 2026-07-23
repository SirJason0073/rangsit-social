'use client';

import ErrorState from '@/components/ui/ErrorState';

export default function AppError({ reset }) {
  return <ErrorState title="This page could not be loaded" description="Check your connection and try again." onRetry={reset} />;
}
