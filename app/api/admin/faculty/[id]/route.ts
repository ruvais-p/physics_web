import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, hashPassword } from '@/lib/auth';

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// GET /api/admin/faculty/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
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
        updatedAt: true,
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty record not found' }, { status: 404 });
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty record:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty record' }, { status: 500 });
  }
}

// PUT /api/admin/faculty/[id] - Edit details, active status, or reset predefined password
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email, designation, department, phone, bio, isActive, newPredefinedPassword } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (designation !== undefined) updateData.designation = designation.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    // If Admin resets password
    if (newPredefinedPassword && newPredefinedPassword.trim().length >= 6) {
      updateData.password = await hashPassword(newPredefinedPassword.trim());
      updateData.mustChangePassword = true; // require password change on next login
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        mustChangePassword: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error('Error updating faculty record:', error);
    return NextResponse.json({ error: 'Failed to update faculty record' }, { status: 500 });
  }
}

// DELETE /api/admin/faculty/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.faculty.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Faculty record deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty record:', error);
    return NextResponse.json({ error: 'Failed to delete faculty record' }, { status: 500 });
  }
}
