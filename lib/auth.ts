import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'physics_dept_super_secret_jwt_key_2026_cusat'
);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: { id: string; email: string; name: string }) {
  return new SignJWT({ ...payload, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { id: string; email: string; name: string; role?: string };
    if (payload.role && payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function signFacultyToken(payload: { id: string; email: string; name: string }) {
  return new SignJWT({ ...payload, role: 'faculty' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyFacultyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { id: string; email: string; name: string; role?: string };
    if (payload.role && payload.role !== 'faculty') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function signAuthToken(payload: { id: string; email: string; name: string; role: 'admin' | 'faculty' }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { id: string; email: string; name: string; role: 'admin' | 'faculty' };
  } catch {
    return null;
  }
}
