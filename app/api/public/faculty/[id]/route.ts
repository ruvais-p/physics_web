import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/public/faculty/[id] - Fetch single faculty member or scholar
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Try finding Faculty by ID
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        profile: true,
        documents: true,
        descriptionRecord: true,
        students: true,
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        publications: {
          orderBy: { publicationDate: 'desc' },
        },
      },
    });

    if (faculty) {
      const profileJson = (faculty.profile?.profiles as Record<string, any>) || {};

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

      const collaboratedProjects = await prisma.facultyProject.findMany({
        where: {
          otherFaculty: {
            contains: faculty.name,
            mode: 'insensitive',
          },
          NOT: {
            facultyId: faculty.id,
          },
        },
        include: {
          faculty: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const ownedProjectsMapped = faculty.projects.map((p) => {
        const startYear = p.startDate ? new Date(p.startDate).getFullYear() : null;
        const endYear = p.endDate ? new Date(p.endDate).getFullYear() : null;
        let duration = '';
        if (startYear && endYear) {
          duration = `${startYear} – ${endYear}`;
        } else if (startYear) {
          duration = `${startYear} – Present`;
        } else if (endYear) {
          duration = `Until ${endYear}`;
        }

        const isOngoing = !p.endDate || new Date(p.endDate) >= new Date();

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          agency: p.agency,
          role: p.role || 'Principal Investigator',
          amount: p.funding,
          duration: duration || null,
          startDate: p.startDate ? p.startDate.toISOString().slice(0, 10) : null,
          endDate: p.endDate ? p.endDate.toISOString().slice(0, 10) : null,
          status: isOngoing ? 'Ongoing' : 'Completed',
          externalLink: p.externalLink,
          otherFaculty: p.otherFaculty,
          isCoFaculty: false,
        };
      });

      const collaboratedProjectsMapped = collaboratedProjects.map((p) => {
        const startYear = p.startDate ? new Date(p.startDate).getFullYear() : null;
        const endYear = p.endDate ? new Date(p.endDate).getFullYear() : null;
        let duration = '';
        if (startYear && endYear) {
          duration = `${startYear} – ${endYear}`;
        } else if (startYear) {
          duration = `${startYear} – Present`;
        } else if (endYear) {
          duration = `Until ${endYear}`;
        }

        const isOngoing = !p.endDate || new Date(p.endDate) >= new Date();

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          agency: p.agency,
          role: 'Co-Investigator / Collaborator',
          amount: p.funding,
          duration: duration || null,
          startDate: p.startDate ? p.startDate.toISOString().slice(0, 10) : null,
          endDate: p.endDate ? p.endDate.toISOString().slice(0, 10) : null,
          status: isOngoing ? 'Ongoing' : 'Completed',
          externalLink: p.externalLink,
          otherFaculty: `PI: ${p.faculty.name}${p.otherFaculty ? `, ${p.otherFaculty}` : ''}`,
          isCoFaculty: true,
        };
      });

      return NextResponse.json({
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
        designation: faculty.designation || 'Faculty Member',
        department: faculty.department || 'Department of Physics',
        qualification: 'Ph.D. in Physics',
        phone: faculty.profile?.phone || faculty.phone || '',
        room: 'Department Building',
        bio: faculty.descriptionRecord?.description || faculty.bio || 'Faculty member in the Department of Physics.',
        image: faculty.documents?.image || '/faculty.png',
        cvUrl: faculty.documents?.cv || null,
        socialLinks,
        customProfiles,
        type: 'faculty' as const,
        students: faculty.students.map((s) => ({
          id: s.uid,
          name: s.name,
          description: s.description,
          image: s.image || '/faculty.png',
          supervisor: faculty.name,
          topic: s.description || 'Guided Student Project',
          fellowship: 'Research Fellowship',
          joiningYear: new Date(s.createdAt).getFullYear(),
          email: faculty.email,
          type: 'scholar' as const,
        })),
        projects: [...ownedProjectsMapped, ...collaboratedProjectsMapped],
        publications: faculty.publications.map((pub) => ({
          id: pub.id,
          title: pub.title,
          journal: pub.journal,
          authors: pub.authors,
          publicationDate: pub.publicationDate ? pub.publicationDate.toISOString().slice(0, 10) : null,
          year: pub.publicationDate ? new Date(pub.publicationDate).getFullYear() : null,
          externalLink: pub.externalLink,
          doi: pub.doi,
          category: pub.category || 'Journal Article',
          description: pub.description,
        })),
      });
    }

    // 2. Try finding Guided Student by UID
    const student = await prisma.facultyStudent.findUnique({
      where: { uid: id },
      include: { faculty: true },
    });

    if (student) {
      return NextResponse.json({
        id: student.uid,
        name: student.name,
        supervisor: student.faculty.name,
        topic: student.description || 'Guided Research Project',
        fellowship: 'Research Fellowship',
        joiningYear: new Date(student.createdAt).getFullYear(),
        email: student.faculty.email,
        image: student.image || '/faculty.png',
        type: 'scholar' as const,
      });
    }

    return NextResponse.json({ error: 'Person not found' }, { status: 404 });
  } catch (error) {
    console.error('GET /api/public/faculty/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
