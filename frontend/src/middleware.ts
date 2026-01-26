import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ============================================
// ROUTE PROTECTION CONFIGURATION
// ============================================
// Set to false to disable route protection (useful for testing video calling)
const ENABLE_ROUTE_PROTECTION = true;
// ============================================

export async function middleware(request: NextRequest) {
  // If route protection is disabled, allow all requests
  if (!ENABLE_ROUTE_PROTECTION) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Skip protection for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  // Public routes that authenticated users should not access
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify-email'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/calendar', '/chat', '/settings', '/teams', '/meet'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If user is authenticated and tries to access public routes, redirect to dashboard
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
