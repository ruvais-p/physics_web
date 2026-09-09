import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_ISSUER = 'physics-department-web';
const JWT_AUDIENCE = 'physics-department-dashboard';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidSession(token: string) {
  const secret = getJwtSecret();
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.credentialVersion === 'string' &&
      (payload.role === 'admin' || payload.role === 'faculty')
    );
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('admin_token')?.value ||
    request.cookies.get('faculty_token')?.value;

  // Reject browser cross-site state-changing requests before they reach an API handler.
  if (pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const fetchSite = request.headers.get('sec-fetch-site');
    const origin = request.headers.get('origin');

    if (fetchSite === 'cross-site' || (origin && origin !== request.nextUrl.origin)) {
      return NextResponse.json({ error: 'Cross-site request rejected' }, { status: 403 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(contentLength) && contentLength > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
    }
  }

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

    if (await hasValidSession(authToken)) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If accessing /login while already authenticated -> redirect to /dashboard
  if (pathname === '/login') {
    if (authToken) {
      if (await hasValidSession(authToken)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
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
    '/api/:path*',
  ],
};
