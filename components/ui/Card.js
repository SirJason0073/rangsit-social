import { cn } from '@/utils/cn';

export function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={cn('card', className)} {...props}>
      {children}
    </Component>
  );
}

export function Panel({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={cn('panel', className)} {...props}>
      {children}
    </Component>
  );
}

export function SubtlePanel({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={cn('panel-subtle', className)} {...props}>
      {children}
    </Component>
  );
}
