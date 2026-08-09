import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'physics_dept_super_secret_jwt_key_2026_cusat'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  const facultyToken = request.cookies.get('faculty_token')?.value;

  // 1. If accessing protected admin routes (e.g. /admin/dashboard)
  if (pathname.startsWith('/admin/dashboard')) {
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(adminToken, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      // Invalid/Expired token -> redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. If accessing admin login page while already authenticated -> redirect to dashboard
  if (pathname === '/admin/login' && adminToken) {
    try {
      await jwtVerify(adminToken, JWT_SECRET);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch {
      // Token expired, allow viewing login page
    }
  }

  // 3. If accessing protected faculty routes (e.g. /faculty/dashboard)
  if (pathname.startsWith('/faculty/dashboard')) {
    if (!facultyToken) {
      const loginUrl = new URL('/faculty/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(facultyToken, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/faculty/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If accessing faculty login page while already authenticated -> redirect to faculty dashboard
  if (pathname === '/faculty/login' && facultyToken) {
    try {
      await jwtVerify(facultyToken, JWT_SECRET);
      return NextResponse.redirect(new URL('/faculty/dashboard', request.url));
    } catch {
      // Token expired, allow login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/login',
    '/faculty/dashboard/:path*',
    '/faculty/login',
  ],
};

