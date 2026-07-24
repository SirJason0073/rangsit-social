import Image from 'next/image';
import { cn } from '@/utils/cn';

const sizeMap = {
  sm: { className: 'avatar-sm', pixels: 32 },
  md: { className: 'avatar-md', pixels: 40 },
  lg: { className: 'avatar-lg', pixels: 56 },
  xl: { className: 'avatar-xl', pixels: 96 }
};

export default function Avatar({ src, alt, fallback = '?', size = 'md', status, className = '' }) {
  const config = sizeMap[size] || sizeMap.md;
  return (
    <span className={cn('relative inline-flex shrink-0', config.className, className)}>
      {src ? (
        <Image src={src} alt={alt} width={config.pixels} height={config.pixels} className="avatar-image h-full w-full rounded-full object-cover ring-1 ring-border" />
      ) : (
        <span aria-label={alt} role="img" className="inline-flex h-full w-full items-center justify-center rounded-full bg-brand-subtle font-semibold text-brand-strong ring-1 ring-border">
          {fallback.slice(0, 1).toUpperCase()}
        </span>
      )}
      {status ? <><span aria-hidden="true" className={cn('absolute bottom-0 right-0 block h-[28%] w-[28%] rounded-full border-2 border-surface-elevated', status === 'online' ? 'bg-success' : 'bg-foreground-muted')} /><span className="sr-only">{status} status</span></> : null}
    </span>
  );
}
