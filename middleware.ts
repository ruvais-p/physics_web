import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'physics_dept_super_secret_jwt_key_2026_cusat'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('admin_token')?.value ||
    request.cookies.get('faculty_token')?.value;

  // 1. Redirect legacy/direct admin & faculty paths (/admin, /admin/dashboard, /faculty, /faculty/dashboard) to /dashboard
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/faculty' ||
    pathname.startsWith('/faculty/')
  ) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Protect unified /dashboard route
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(authToken, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If accessing /login while already authenticated -> redirect to /dashboard
  if (pathname === '/login') {
    if (authToken) {
      try {
        await jwtVerify(authToken, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Token invalid/expired, proceed to login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
    '/faculty',
    '/faculty/:path*',
  ],
};
