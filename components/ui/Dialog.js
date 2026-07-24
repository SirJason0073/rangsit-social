'use client';

import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';
import { cn } from '@/utils/cn';

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };

export default function Dialog({ open, onOpenChange, title, description, children, footer, size = 'md', closeLabel = 'Close dialog' }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog ref={dialogRef} className={cn('dialog-surface m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto overscroll-contain rounded-panel border border-border bg-surface-elevated p-0 text-foreground shadow-3', widths[size] || widths.md)} onCancel={(event) => { event.preventDefault(); onOpenChange(false); }} onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="type-h3">{title}</h2>
            {description ? <p id={descriptionId} className="mt-2 text-sm text-foreground-secondary">{description}</p> : null}
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-foreground-muted transition duration-fast hover:bg-surface-muted hover:text-foreground" aria-label={closeLabel}><Icon name="close" /></button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-4">{footer}</div> : null}
      </div>
    </dialog>
  );
}
