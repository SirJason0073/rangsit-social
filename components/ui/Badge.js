import { cn } from '@/utils/cn';

const tones = {
  brand: 'bg-brand-subtle text-brand-strong',
  neutral: 'bg-surface-muted text-foreground-secondary',
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger'
};

export default function Badge({ as: Component = 'span', tone = 'brand', className = '', children, ...props }) {
  return (
    <Component className={cn('inline-flex min-h-6 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none', tones[tone] || tones.brand, className)} {...props}>
      {children}
    </Component>
  );
}
