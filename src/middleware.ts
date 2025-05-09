import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authTokenCookie = request.cookies.get('authToken');

  // If trying to access /login or /signup and is authenticated (token exists in cookie)
  if ((pathname === '/login' || pathname === '/signup') && authTokenCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected app routes and no token, redirect to login
  // This part is largely handled by AppLayout now, but middleware can be an early gate
  // For example, if /app/* routes should all be protected
  // if (pathname.startsWith('/dashboard') && !authTokenCookie) { // Or more generic like /app
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login', 
    '/signup',
    // '/dashboard/:path*', // Example if you want middleware to protect dashboard routes directly
    // '/groups/:path*',
    // '/activity/:path*',
    // '/account/:path*',
], 
};
