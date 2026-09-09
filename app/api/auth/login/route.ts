import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signAdminToken, signFacultyToken } from '@/lib/auth';
import { clearRateLimit, consumeRateLimit, getClientAddress } from '@/lib/rate-limit';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;
const DUMMY_PASSWORD_HASH = '$2b$12$pTIPYwAqbW.U0bx5jG5kMehrTl0Th.XOleDUBU8vf6mJzbwlYWGXa';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 254 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
    }

    const clientAddress = getClientAddress(request);
    const rateLimitKey = `login:${clientAddress}:${cleanEmail}`;
    const addressRateLimitKey = `login-address:${clientAddress}`;
    const accountRateLimit = consumeRateLimit(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_WINDOW_MS);
    const addressRateLimit = consumeRateLimit(addressRateLimitKey, 40, LOGIN_WINDOW_MS);
    if (!accountRateLimit.allowed || !addressRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.max(accountRateLimit.retryAfterSeconds, addressRateLimit.retryAfterSeconds)),
          },
        }
      );
    }

    const [admin, faculty] = await Promise.all([
      prisma.admin.findUnique({ where: { email: cleanEmail } }),
      prisma.faculty.findUnique({ where: { email: cleanEmail } }),
    ]);
    let passwordWasChecked = false;

    if (admin) {
      passwordWasChecked = true;
      const isAdminPasswordValid = await verifyPassword(password, admin.password);
      if (isAdminPasswordValid) {
        clearRateLimit(rateLimitKey);
        const token = await signAdminToken({
          id: admin.id,
          email: admin.email,
          name: admin.name,
        }, admin.password);

        const response = NextResponse.json({
          success: true,
          role: 'admin',
          redirectTo: '/dashboard',
          user: {
            email: admin.email,
            name: admin.name,
          },
        });

        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 8,
          path: '/',
        });

        response.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 8,
          path: '/',
        });
        response.cookies.delete('faculty_token');

        return response;
      }
    }

    if (faculty) {
      passwordWasChecked = true;
      const isFacultyPasswordValid = await verifyPassword(password, faculty.password);
      if (isFacultyPasswordValid && faculty.isActive) {
        clearRateLimit(rateLimitKey);
        const token = await signFacultyToken({
          id: faculty.id,
          email: faculty.email,
          name: faculty.name,
        }, faculty.password);

        const response = NextResponse.json({
          success: true,
          role: 'faculty',
          redirectTo: '/dashboard',
          user: {
            id: faculty.id,
            name: faculty.name,
            email: faculty.email,
            mustChangePassword: faculty.mustChangePassword,
          },
        });

        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        response.cookies.set('faculty_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });
        response.cookies.delete('admin_token');

        return response;
      }
    }

    // Keep unknown-account failures close to the cost of a real password check.
    if (!passwordWasChecked) {
      await verifyPassword(password, DUMMY_PASSWORD_HASH);
    }

    return NextResponse.json(
      { error: 'Invalid email address or password. Please check your credentials.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Unified login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during authentication.' },
      { status: 500 }
    );
  }
}
