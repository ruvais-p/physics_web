import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

export async function GET() {
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

    const faculty = await prisma.faculty.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        phone: true,
        bio: true,
        mustChangePassword: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!faculty || !faculty.isActive) {
      return NextResponse.json({ error: 'Faculty account not found or deactivated' }, { status: 404 });
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error fetching current faculty profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
