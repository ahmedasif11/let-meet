import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // if (
  //   pathname.startsWith('/_next/') ||
  //   pathname.startsWith('/api/') ||
  //   pathname.includes('.') ||
  //   pathname.startsWith('/favicon.ico')
  // ) {
  //   return NextResponse.next();
  // }

  // const token = await getToken({ req: request });

  // if (!token && !pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  // if (token && pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/auth/:path*',
    '/:path*',
  ],
};
