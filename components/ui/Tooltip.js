'use client';

import { cloneElement, isValidElement, useId } from 'react';

export default function Tooltip({ label, children }) {
  const id = useId();
  const trigger = isValidElement(children)
    ? cloneElement(children, { 'aria-describedby': id })
    : <span aria-describedby={id}>{children}</span>;
  return (
    <span className="group relative inline-flex">
      {trigger}
      <span id={id} role="tooltip" className="pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-control bg-surface-inverse px-2.5 py-1.5 text-xs text-foreground-inverse shadow-2 group-hover:block group-focus-within:block">
        {label}
      </span>
    </span>
  );
}
