import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('auth_token')?.value ||
      cookieStore.get('admin_token')?.value ||
      cookieStore.get('faculty_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const role = payload.role;

    if (role === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, name: true },
      });

      if (!admin) {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        role: 'admin',
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    }

    if (role === 'faculty') {
      const faculty = await prisma.faculty.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          name: true,
          designation: true,
          department: true,
          phone: true,
          mustChangePassword: true,
          isActive: true,
        },
      });

      if (!faculty || !faculty.isActive) {
        return NextResponse.json({ error: 'Faculty profile unavailable or deactivated' }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        role: 'faculty',
        user: faculty,
      });
    }

    return NextResponse.json({ error: 'Invalid role specification' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching /api/auth/me:', error);
    return NextResponse.json({ error: 'Unauthorized or expired session' }, { status: 401 });
  }
}
