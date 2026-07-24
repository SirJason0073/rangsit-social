import Link from 'next/link';
import BrandLogo from './BrandLogo';
import PageTransition from './PageTransition';
import ThemeToggle from './ui/ThemeToggle';

export default function GuestShell({ children }) {
  return (
    <div className="app-shell guest-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="border-b border-border bg-surface-elevated/95">
        <div className="container flex min-h-header items-center justify-between gap-4 py-3">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <nav aria-label="Account navigation" className="hidden items-center gap-1 sm:flex">
              <Link href="/login" className="nav-pill">Log in</Link>
              <Link href="/signup" className="nav-pill">Create account</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main-content" className="container flex min-h-[calc(100dvh-var(--header-height))] items-start py-page-y lg:items-center" tabIndex="-1">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
