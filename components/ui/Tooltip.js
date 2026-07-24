'use client';

import { cloneElement, isValidElement, useId } from 'react';
import { cn } from '@/utils/cn';

export default function Tooltip({ label, children, side = 'bottom' }) {
  const id = useId();
  const trigger = isValidElement(children)
    ? cloneElement(children, { 'aria-describedby': id })
    : <span aria-describedby={id}>{children}</span>;
  return (
    <span className="group relative inline-flex">
      {trigger}
      <span id={id} role="tooltip" className={cn('pointer-events-none invisible absolute left-1/2 z-50 max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-control bg-surface-inverse px-2.5 py-1.5 text-center text-xs leading-5 text-foreground-inverse opacity-0 shadow-2 transition duration-fast group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100', side === 'top' ? 'bottom-[calc(100%+0.5rem)] translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0' : 'top-[calc(100%+0.5rem)] -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0')}>
        {label}
      </span>
    </span>
  );
}
