import { cn } from '@/utils/cn';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
}

export function Panel({ className = '', children, ...props }) {
  return (
    <div className={cn('panel', className)} {...props}>
      {children}
    </div>
  );
}

export function SubtlePanel({ className = '', children, ...props }) {
  return (
    <div className={cn('panel-subtle', className)} {...props}>
      {children}
    </div>
  );
}
