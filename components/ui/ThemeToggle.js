'use client';

import { useTheme } from '@/components/ThemeProvider';
import Icon from './Icon';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button type="button" onClick={() => setTheme(nextTheme)} className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border bg-surface-elevated text-foreground-secondary transition duration-fast hover:border-brand hover:bg-brand-subtle hover:text-brand-strong">
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      <span className="sr-only">Switch to {nextTheme} mode</span>
    </button>
  );
}
