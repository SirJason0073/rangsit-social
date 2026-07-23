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
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  md: '',
  lg: 'min-h-12 px-5 py-3 text-base'
};

const Button = forwardRef(function Button(
  { className = '', variant = 'primary', size = 'md', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      {...props}
    />
  );
});

export default Button;
