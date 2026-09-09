import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken, verifyPassword, hashPassword, signFacultyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('faculty_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFacultyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128) {
      return NextResponse.json(
        { error: 'New password must be between 12 and 128 characters.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    // Fetch existing faculty member
    const faculty = await prisma.faculty.findUnique({
      where: { id: payload.id },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty account not found.' }, { status: 404 });
    }

    if (typeof currentPassword !== 'string' || !(await verifyPassword(currentPassword, faculty.password))) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    // Hash new password and set mustChangePassword = false
    const newHashedPassword = await hashPassword(newPassword);

    const updatedFaculty = await prisma.faculty.update({
      where: { id: payload.id },
      data: {
        password: newHashedPassword,
        mustChangePassword: false,
      },
    });

    const newToken = await signFacultyToken({
      id: updatedFaculty.id,
      email: updatedFaculty.email,
      name: updatedFaculty.name,
    }, updatedFaculty.password);

    const response = NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
    });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24,
      path: '/',
    };
    response.cookies.set('auth_token', newToken, cookieOptions);
    response.cookies.set('faculty_token', newToken, cookieOptions);
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the password.' },
      { status: 500 }
    );
  }
}
