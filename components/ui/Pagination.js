'use client';

import Button from './Button';
import Icon from './Icon';

export default function Pagination({ page, totalPages, onPageChange, disabled = false, label = 'Pagination' }) {
  if (!totalPages || totalPages <= 1) return null;
  const safePage = Math.min(Math.max(page, 1), totalPages);
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <Button variant="outline" size="sm" disabled={disabled || safePage <= 1} onClick={() => onPageChange(safePage - 1)}>
        <Icon name="chevronLeft" size="sm" /> Previous
      </Button>
      <p className="text-sm text-foreground-secondary" aria-live="polite">Page <strong className="text-foreground">{safePage}</strong> of {totalPages}</p>
      <Button variant="outline" size="sm" disabled={disabled || safePage >= totalPages} onClick={() => onPageChange(safePage + 1)}>
        Next <Icon name="chevronRight" size="sm" />
      </Button>
    </nav>
  );
}
