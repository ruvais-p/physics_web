import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signAdminToken, signFacultyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Admin authentication first
    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (admin) {
      const isAdminPasswordValid = await verifyPassword(password, admin.password);
      if (isAdminPasswordValid) {
        const token = await signAdminToken({
          id: admin.id,
          email: admin.email,
          name: admin.name,
        });

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
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        response.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        return response;
      }
    }

    // 2. Try Faculty authentication
    const faculty = await prisma.faculty.findUnique({
      where: { email: cleanEmail },
    });

    if (faculty) {
      if (!faculty.isActive) {
        return NextResponse.json(
          { error: 'Your faculty account is deactivated. Please contact the department administrator.' },
          { status: 403 }
        );
      }

      const isFacultyPasswordValid = await verifyPassword(password, faculty.password);
      if (isFacultyPasswordValid) {
        const token = await signFacultyToken({
          id: faculty.id,
          email: faculty.email,
          name: faculty.name,
        });

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
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        response.cookies.set('faculty_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        return response;
      }
    }

    // 3. Neither admin nor faculty matched with valid credentials
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
