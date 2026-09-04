import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/public/faculty - Fetch all active faculty members for public pages
export async function GET() {
  try {
    const facultyList = await prisma.faculty.findMany({
      where: { isActive: true },
      include: {
        profile: true,
        documents: true,
        descriptionRecord: true,
        students: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    const formattedFaculty = facultyList.map((f) => {
      const profileJson = (f.profile?.profiles as Record<string, any>) || {};

      // Parse social and public profile links
      const socialLinks: Record<string, string> = {};
      if (profileJson.google_scholar) socialLinks.scholar = profileJson.google_scholar;
      if (profileJson.scopus) socialLinks.scopus = profileJson.scopus;
      if (profileJson.orcid) socialLinks.orcid = profileJson.orcid;
      if (profileJson.linkedin) socialLinks.linkedin = profileJson.linkedin;
      if (profileJson.moodle) socialLinks.moodle = profileJson.moodle;
      if (profileJson.iqac_profile) socialLinks.iqac = profileJson.iqac_profile;
      if (profileJson.iris) socialLinks.iris = profileJson.iris;
      if (profileJson.youtube) socialLinks.youtube = profileJson.youtube;
      if (profileJson.personal_website) socialLinks.website = profileJson.personal_website;

      const customProfiles = Array.isArray(profileJson.other) ? profileJson.other : [];

      return {
        id: f.id,
        name: f.name,
        email: f.email,
        designation: f.designation || 'Faculty Member',
        department: f.department || 'Department of Physics',
        qualification: 'Ph.D. in Physics',
        phone: f.profile?.phone || f.phone || '',
        room: 'Department Building',
        bio: f.descriptionRecord?.description || f.bio || 'Faculty member in the Department of Physics.',
        image: f.documents?.image || '/faculty.png',
        cvUrl: f.documents?.cv || null,
        socialLinks,
        customProfiles,
        type: 'faculty' as const,
        students: f.students.map((s) => ({
          id: s.uid,
          name: s.name,
          description: s.description,
          image: s.image || '/faculty.png',
          supervisor: f.name,
          topic: s.description || 'Guided Student Project',
          fellowship: 'Research Fellowship',
          joiningYear: new Date(s.createdAt).getFullYear(),
          email: f.email,
          type: 'scholar' as const,
        })),
      };
    });

    return NextResponse.json(formattedFaculty);
  } catch (error) {
    console.error('GET /api/public/faculty error:', error);
    return NextResponse.json({ error: 'Failed to fetch public faculty list' }, { status: 500 });
  }
}
