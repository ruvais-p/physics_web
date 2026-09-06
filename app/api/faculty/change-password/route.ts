import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken, verifyPassword, hashPassword } from '@/lib/auth';

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

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
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

    // If currentPassword provided, verify it
    if (currentPassword) {
      const isMatch = await verifyPassword(currentPassword, faculty.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Current predefined password is incorrect.' },
          { status: 400 }
        );
      }
    }

    // Hash new password and set mustChangePassword = false
    const newHashedPassword = await hashPassword(newPassword);

    await prisma.faculty.update({
      where: { id: payload.id },
      data: {
        password: newHashedPassword,
        mustChangePassword: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the password.' },
      { status: 500 }
    );
  }
}
