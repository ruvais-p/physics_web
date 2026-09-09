import { cookies } from 'next/headers';
import { verifyAdminToken, verifyFacultyToken } from '@/lib/auth';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('auth_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function getFacultySession() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('faculty_token')?.value ||
    cookieStore.get('auth_token')?.value;
  return token ? verifyFacultyToken(token) : null;
}
