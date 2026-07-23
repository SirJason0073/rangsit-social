import Image from 'next/image';
import { cn } from '@/utils/cn';

const sizeMap = {
  sm: { className: 'avatar-sm', pixels: 32 },
  md: { className: 'avatar-md', pixels: 40 },
  lg: { className: 'avatar-lg', pixels: 56 },
  xl: { className: 'avatar-xl', pixels: 96 }
};

export default function Avatar({ src, alt, fallback = '?', size = 'md', className = '' }) {
  const config = sizeMap[size] || sizeMap.md;
  if (src) {
    return <Image src={src} alt={alt} width={config.pixels} height={config.pixels} className={cn(config.className, 'shrink-0 rounded-full object-cover', className)} />;
  }
  return (
    <span aria-label={alt} role="img" className={cn(config.className, 'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-subtle font-semibold text-brand-strong', className)}>
      {fallback.slice(0, 1).toUpperCase()}
    </span>
  );
}
