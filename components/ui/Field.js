import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import Icon from './Icon';

export function Field({ className = '', children, ...props }) {
  return <div className={cn('space-y-2', className)} {...props}>{children}</div>;
}

export function FieldLabel({ className = '', children, ...props }) {
  return (
    <label className={cn('field-label', className)} {...props}>
      {children}
    </label>
  );
}

export function FieldHint({ className = '', children, ...props }) {
  return (
    <p className={cn('field-hint', className)} {...props}>
      {children}
    </p>
  );
}

export function FieldError({ className = '', children, ...props }) {
  if (!children) return null;
  return <p role="alert" className={cn('text-sm text-danger', className)} {...props}>{children}</p>;
}

export const TextInput = forwardRef(function TextInput({ className = '', ...props }, ref) {
  return <input ref={ref} className={cn('input', className)} {...props} />;
});

export const TextArea = forwardRef(function TextArea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={cn('textarea', className)} {...props} />;
});

export const Select = forwardRef(function Select({ className = '', children, ...props }, ref) {
  return <select ref={ref} className={cn('input appearance-none bg-[linear-gradient(45deg,transparent_50%,rgb(var(--color-text-muted))_50%),linear-gradient(135deg,rgb(var(--color-text-muted))_50%,transparent_50%)] bg-[position:calc(100%-18px)_50%,calc(100%-13px)_50%] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-10', className)} {...props}>{children}</select>;
});

export const Checkbox = forwardRef(function Checkbox({ className = '', label, description, ...props }, ref) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm text-foreground-secondary', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <input ref={ref} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-brand focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-surface" {...props} />
      <span>
        <span className="block font-medium text-foreground">{label}</span>
        {description ? <span className="mt-0.5 block text-xs leading-5 text-foreground-muted">{description}</span> : null}
      </span>
    </label>
  );
});

export const Radio = forwardRef(function Radio({ className = '', label, description, ...props }, ref) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm text-foreground-secondary', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <input ref={ref} type="radio" className="mt-0.5 h-5 w-5 shrink-0 accent-brand focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-surface" {...props} />
      <span>
        <span className="block font-medium text-foreground">{label}</span>
        {description ? <span className="mt-0.5 block text-xs leading-5 text-foreground-muted">{description}</span> : null}
      </span>
    </label>
  );
});

export const UploadControl = forwardRef(function UploadControl({ className = '', label = 'Choose file', hint, accept, onChange, ...props }, ref) {
  return (
    <label className={cn('group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-surface px-5 py-6 text-center transition duration-fast hover:border-brand hover:bg-brand-subtle', props.disabled && 'cursor-not-allowed opacity-60', className)}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-subtle text-brand-strong" aria-hidden="true"><Icon name="upload" /></span>
      <span className="mt-3 text-sm font-semibold text-foreground">{label}</span>
      {hint ? <span className="mt-1 text-xs leading-5 text-foreground-muted">{hint}</span> : null}
      <input ref={ref} type="file" accept={accept} onChange={onChange} className="sr-only" {...props} />
    </label>
  );
});
