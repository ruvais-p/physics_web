import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, hashPassword } from '@/lib/auth';

// Utility to verify admin authentication
async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// GET /api/admin/faculty - List all faculty members
export async function GET() {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const facultyMembers = await prisma.faculty.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        mustChangePassword: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(facultyMembers);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty records' }, { status: 500 });
  }
}

// POST /api/admin/faculty - Create new faculty account
export async function POST(request: Request) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, designation, department } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Faculty Name is required' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Faculty Email is required' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Predefined Password must be at least 6 characters long' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if faculty with this email already exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { email: cleanEmail },
    });

    if (existingFaculty) {
      return NextResponse.json({ error: 'A faculty account with this email already exists' }, { status: 400 });
    }

    // Hash predefined password
    const hashedPassword = await hashPassword(password);

    // Create faculty record
    const newFaculty = await prisma.faculty.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        mustChangePassword: true,
        designation: designation?.trim() || 'Faculty Member',
        department: department?.trim() || 'Department of Physics',
      },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        mustChangePassword: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.error('Error creating faculty account:', error);
    return NextResponse.json({ error: 'Failed to create faculty account' }, { status: 500 });
  }
}
