import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

const PREDEFINED_KEYS = [
  'google_scholar',
  'scopus',
  'orcid',
  'moodle',
  'iqac_profile',
  'iris',
  'youtube',
  'personal_website',
  'linkedin',
];

function isValidUrl(string: string): boolean {
  if (!string || typeof string !== 'string') return false;
  const trimmed = string.trim();
  if (!trimmed) return true; // empty strings allowed if optional
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET /api/faculty/profile
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

    // Fetch faculty record and associated profile
    const faculty = await prisma.faculty.findUnique({
      where: { id: payload.id },
      include: { profile: true },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty record not found' }, { status: 404 });
    }

    const profileData = faculty.profile ? faculty.profile.profiles : {};
    const phoneData = faculty.profile?.phone || faculty.phone || '';

    return NextResponse.json({
      uid: faculty.profile?.uid || null,
      facultyId: faculty.id,
      phone: phoneData,
      profiles: profileData,
    });
  } catch (error) {
    console.error('GET /api/faculty/profile error:', error);
    return NextResponse.json({ error: 'Server error fetching faculty profile' }, { status: 500 });
  }
}

// PUT /api/faculty/profile
export async function PUT(request: Request) {
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
    const { phone, profiles } = body;

    if (!profiles || typeof profiles !== 'object') {
      return NextResponse.json({ error: 'Invalid profiles object structure' }, { status: 400 });
    }

    // Validate Predefined Platform URLs
    const sanitizedProfiles: Record<string, any> = {};

    for (const key of PREDEFINED_KEYS) {
      if (profiles[key]) {
        const val = String(profiles[key]).trim();
        if (val) {
          if (!isValidUrl(val)) {
            return NextResponse.json(
              { error: `Invalid URL format for ${key.replace(/_/g, ' ')}. URLs must start with http:// or https://` },
              { status: 400 }
            );
          }
          sanitizedProfiles[key] = val;
        }
      }
    }

    // Validate "other" custom entries array
    if (Array.isArray(profiles.other)) {
      const sanitizedOther: Array<{ name: string; url: string }> = [];
      const seenNames = new Set<string>();

      for (const item of profiles.other) {
        if (item && typeof item === 'object') {
          const name = String(item.name || '').trim();
          const url = String(item.url || '').trim();

          if (name && url) {
            if (!isValidUrl(url)) {
              return NextResponse.json(
                { error: `Invalid URL format for custom profile "${name}". Must start with http:// or https://` },
                { status: 400 }
              );
            }

            const lowerName = name.toLowerCase();
            if (seenNames.has(lowerName)) {
              return NextResponse.json(
                { error: `Duplicate custom profile entry found: "${name}"` },
                { status: 400 }
              );
            }
            seenNames.add(lowerName);

            sanitizedOther.push({ name, url });
          }
        }
      }

      if (sanitizedOther.length > 0) {
        sanitizedProfiles.other = sanitizedOther;
      }
    }

    const cleanPhone = phone ? String(phone).trim() : null;

    // Upsert FacultyProfile record in DB
    const updatedProfile = await prisma.facultyProfile.upsert({
      where: { facultyId: payload.id },
      update: {
        phone: cleanPhone,
        profiles: sanitizedProfiles,
      },
      create: {
        facultyId: payload.id,
        phone: cleanPhone,
        profiles: sanitizedProfiles,
      },
    });

    // Also sync phone back to main Faculty table if set
    if (cleanPhone !== null) {
      await prisma.faculty.update({
        where: { id: payload.id },
        data: { phone: cleanPhone },
      });
    }

    return NextResponse.json({
      success: true,
      uid: updatedProfile.uid,
      facultyId: updatedProfile.facultyId,
      phone: updatedProfile.phone,
      profiles: updatedProfile.profiles,
    });
  } catch (error) {
    console.error('PUT /api/faculty/profile error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating public profile details.' },
      { status: 500 }
    );
  }
}
