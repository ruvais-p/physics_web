import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'physics_dept_super_secret_jwt_key_2026_cusat'
);

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

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload || !payload.role) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const role = payload.role as 'admin' | 'faculty';

    if (role === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { id: payload.id as string },
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
        where: { id: payload.id as string },
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
