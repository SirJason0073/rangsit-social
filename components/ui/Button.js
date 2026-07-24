'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger'
};

const sizes = {
  sm: 'min-h-11 px-3 py-2 text-sm',
  md: '',
  lg: 'min-h-12 px-5 py-3 text-base'
};

const Button = forwardRef(function Button(
  { children, className = '', variant = 'primary', size = 'md', type = 'button', loading = false, loadingLabel = 'Loading', ...props },
  ref
) {
  const disabled = loading || props.disabled;
  return (
    <button
      ref={ref}
      type={type}
      className={cn(variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
      disabled={disabled}
      aria-busy={loading || undefined}
    >
      {loading ? <span aria-hidden="true" className="loading-spinner" /> : null}
      {loading ? <span>{loadingLabel}</span> : children}
    </button>
  );
});

export default Button;
