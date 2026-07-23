'use client';

import { useTheme } from '@/components/ThemeProvider';
import Icon from './Icon';
import Tooltip from './Tooltip';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip label={`Switch to ${nextTheme} mode`}>
      <button type="button" onClick={() => setTheme(nextTheme)} className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border bg-surface-elevated text-foreground-secondary transition duration-fast hover:border-brand hover:bg-brand-subtle hover:text-brand-strong" aria-label={`Switch to ${nextTheme} mode`}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
    </Tooltip>
  );
}
