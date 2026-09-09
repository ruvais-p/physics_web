import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export type AuthRole = 'admin' | 'faculty';
export type AuthPayload = JWTPayload & {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  credentialVersion: string;
};

const JWT_ISSUER = 'physics-department-web';
const JWT_AUDIENCE = 'physics-department-dashboard';

function credentialVersion(passwordHash: string) {
  return createHash('sha256').update(passwordHash).digest('base64url').slice(0, 22);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.');
  }

  return new TextEncoder().encode(secret);
}

function isAuthPayload(payload: JWTPayload): payload is AuthPayload {
  return (
    typeof payload.id === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.name === 'string' &&
    typeof payload.credentialVersion === 'string' &&
    (payload.role === 'admin' || payload.role === 'faculty')
  );
}

async function hasCurrentCredentials(payload: AuthPayload) {
  if (payload.role === 'admin') {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { email: true, password: true },
    });
    return Boolean(
      admin &&
      admin.email === payload.email &&
      credentialVersion(admin.password) === payload.credentialVersion,
    );
  }

  const faculty = await prisma.faculty.findUnique({
    where: { id: payload.id },
    select: { email: true, password: true, isActive: true },
  });
  return Boolean(
    faculty &&
    faculty.isActive &&
    faculty.email === payload.email &&
    credentialVersion(faculty.password) === payload.credentialVersion,
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(
  payload: { id: string; email: string; name: string },
  passwordHash: string,
) {
  return new SignJWT({ ...payload, role: 'admin', credentialVersion: credentialVersion(passwordHash) })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (!isAuthPayload(payload) || payload.role !== 'admin') return null;
    return (await hasCurrentCredentials(payload)) ? payload : null;
  } catch {
    return null;
  }
}

export async function signFacultyToken(
  payload: { id: string; email: string; name: string },
  passwordHash: string,
) {
  return new SignJWT({ ...payload, role: 'faculty', credentialVersion: credentialVersion(passwordHash) })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyFacultyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (!isAuthPayload(payload) || payload.role !== 'faculty') return null;
    return (await hasCurrentCredentials(payload)) ? payload : null;
  } catch {
    return null;
  }
}

export async function signAuthToken(
  payload: { id: string; email: string; name: string; role: AuthRole },
  passwordHash: string,
) {
  return new SignJWT({ ...payload, credentialVersion: credentialVersion(passwordHash) })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (!isAuthPayload(payload)) return null;
    return (await hasCurrentCredentials(payload)) ? payload : null;
  } catch {
    return null;
  }
}
