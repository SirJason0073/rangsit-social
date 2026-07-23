import Image from 'next/image';
import Link from 'next/link';

export default function BrandLogo({ compact = false, dark = false }) {
  return (
    <Link href="/feed" className="group inline-flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-card bg-surface-inverse shadow-2 ring-1 ring-border">
        <Image
          src="/rangsit-logo.png"
          alt="Rangsit University"
          width={34}
          height={34}
          className="h-8 w-8 object-contain transition duration-300 group-hover:scale-105"
          priority
        />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className={`truncate text-base font-semibold tracking-tight ${dark ? 'text-foreground-inverse' : 'text-foreground'}`}>
            Rangsit Social
          </p>
          <p className={`truncate text-xs font-medium uppercase tracking-[0.2em] ${dark ? 'text-foreground-inverse/75' : 'text-foreground-muted'}`}>
            University Network
          </p>
        </div>
      )}
    </Link>
  );
}
