import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

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

export const TextInput = forwardRef(function TextInput({ className = '', ...props }, ref) {
  return <input ref={ref} className={cn('input', className)} {...props} />;
});

export const TextArea = forwardRef(function TextArea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={cn('textarea', className)} {...props} />;
});
