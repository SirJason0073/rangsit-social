import { NextResponse } from 'next/server';

const protectedPrefixes = ['/feed', '/onboarding', '/posts', '/profile', '/saved', '/search', '/notifications', '/settings'];
const guestOnlyPrefixes = ['/login', '/signup'];

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('rangsit_token')?.value;

  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isGuestOnly = guestOnlyPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!token && isProtected) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/login') {
      loginUrl.searchParams.set('next', `${pathname}${search}`);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (token && isGuestOnly) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/feed/:path*', '/login', '/signup', '/onboarding', '/posts/:path*', '/profile/:path*', '/saved', '/search/:path*', '/notifications', '/settings']
};
