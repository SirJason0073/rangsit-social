'use client';

import { useId } from 'react';
import { cn } from '@/utils/cn';

export default function Switch({ checked, onChange, label, description, disabled = false, className = '' }) {
  const id = useId();
  const descriptionId = `${id}-description`;
  return (
    <div className={cn('flex items-start justify-between gap-4 py-3', className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-semibold text-foreground">{label}</label>
        {description ? <p id={descriptionId} className="mt-0.5 text-sm text-foreground-secondary">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descriptionId : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50', checked ? 'border-brand bg-brand' : 'border-border-strong bg-surface-muted')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-1 transition-transform duration-fast', checked ? 'translate-x-5' : 'translate-x-0.5')} />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}
