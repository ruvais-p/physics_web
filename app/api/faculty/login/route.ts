import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signFacultyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Faculty email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Look up faculty record
    const faculty = await prisma.faculty.findUnique({
      where: { email: cleanEmail },
    });

    if (!faculty) {
      return NextResponse.json(
        { error: 'Invalid faculty credentials.' },
        { status: 401 }
      );
    }

    if (!faculty.isActive) {
      return NextResponse.json(
        { error: 'Your account is deactivated. Please contact the administrator.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, faculty.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid faculty credentials.' },
        { status: 401 }
      );
    }

    // Issue faculty JWT token
    const token = await signFacultyToken({
      id: faculty.id,
      email: faculty.email,
      name: faculty.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        mustChangePassword: faculty.mustChangePassword,
      },
    });

    // Set cookie
    response.cookies.set('faculty_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Faculty login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during faculty login.' },
      { status: 500 }
    );
  }
}
