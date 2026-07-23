'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variants = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost'
};

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: '',
  lg: 'px-5 py-3 text-sm'
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
