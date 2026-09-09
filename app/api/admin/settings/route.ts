import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { encryptSecret } from '@/lib/settings-crypto';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value;

  if (!token) return null;

  const user = await verifyAdminToken(token);
  return user?.role === 'admin' ? user : null;
}

export async function GET() {
  if (!(await authenticateAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.generalSettings.findUnique({
      where: { id: 'general' },
      select: {
        departmentEmail: true,
        hodEmail: true,
        departmentEmailAppPassword: true,
      },
    });

    return NextResponse.json({
      departmentEmail: settings?.departmentEmail || '',
      hodEmail: settings?.hodEmail || '',
      hasAppPassword: Boolean(settings?.departmentEmailAppPassword),
    });
  } catch (error) {
    console.error('Failed to load general settings:', error);
    return NextResponse.json(
      { error: 'Failed to load general settings.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await authenticateAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const departmentEmail = String(body.departmentEmail || '').trim().toLowerCase();
    const hodEmail = String(body.hodEmail || '').trim().toLowerCase();
    const appPassword = String(body.appPassword || '').replace(/\s+/g, '');

    if (appPassword.length > 256) {
      return NextResponse.json({ error: 'App password is invalid.' }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(departmentEmail)) {
      return NextResponse.json(
        { error: 'Enter a valid department email address.' },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(hodEmail)) {
      return NextResponse.json(
        { error: 'Enter a valid HOD email address.' },
        { status: 400 },
      );
    }

    const existing = await prisma.generalSettings.findUnique({
      where: { id: 'general' },
      select: { departmentEmailAppPassword: true },
    });

    if (!appPassword && !existing?.departmentEmailAppPassword) {
      return NextResponse.json(
        { error: 'Department email app password is required.' },
        { status: 400 },
      );
    }

    const encryptedPassword = appPassword
      ? encryptSecret(appPassword)
      : existing?.departmentEmailAppPassword;

    await prisma.generalSettings.upsert({
      where: { id: 'general' },
      update: {
        departmentEmail,
        hodEmail,
        departmentEmailAppPassword: encryptedPassword,
      },
      create: {
        id: 'general',
        departmentEmail,
        hodEmail,
        departmentEmailAppPassword: encryptedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      departmentEmail,
      hodEmail,
      hasAppPassword: true,
    });
  } catch (error) {
    console.error('Failed to save general settings:', error);
    return NextResponse.json(
      { error: 'Failed to save general settings.' },
      { status: 500 },
    );
  }
}
