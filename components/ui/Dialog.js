'use client';

import { useEffect, useId, useRef } from 'react';
import Icon from './Icon';

export default function Dialog({ open, onOpenChange, title, description, children, footer }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="m-auto w-[min(92vw,34rem)] rounded-panel border border-border bg-surface-elevated p-0 text-foreground shadow-3 backdrop:bg-surface-inverse/60 backdrop:backdrop-blur-sm" onCancel={(event) => { event.preventDefault(); onOpenChange(false); }} onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="type-h3">{title}</h2>
            {description ? <p id={descriptionId} className="mt-2 text-sm text-foreground-secondary">{description}</p> : null}
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-control p-2 text-foreground-muted hover:bg-surface-muted hover:text-foreground" aria-label="Close dialog"><Icon name="close" /></button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-4">{footer}</div> : null}
      </div>
    </dialog>
  );
}
