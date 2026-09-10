import ProfilePageClient, { type ProfilePerson } from '@/components/ProfilePageClient';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const faculty = await prisma.faculty.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    return faculty.map((member) => ({ id: member.id }));
  } catch (error) {
    console.error('Failed to generate faculty routes:', error);
    return [];
  }
}

function projectDuration(startDate: Date | null, endDate: Date | null) {
  const startYear = startDate?.getFullYear();
  const endYear = endDate?.getFullYear();
  if (startYear && endYear) return `${startYear} – ${endYear}`;
  if (startYear) return `${startYear} – Present`;
  if (endYear) return `Until ${endYear}`;
  return null;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  let person: ProfilePerson | null = null;

  try {
    const faculty = await prisma.faculty.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        phone: true,
        bio: true,
        profile: { select: { phone: true, profiles: true } },
        documents: { select: { image: true, cv: true } },
        descriptionRecord: { select: { description: true } },
        students: {
          select: { uid: true, name: true, description: true, image: true, createdAt: true },
        },
        projects: { orderBy: { createdAt: 'desc' } },
        publications: { orderBy: { publicationDate: 'desc' } },
      },
    });

    if (faculty) {
      const profileJson = (faculty.profile?.profiles || {}) as Record<string, unknown>;
      const socialLinks: Record<string, string> = {};
      const profileKeys: Record<string, string> = {
        google_scholar: 'scholar',
        scopus: 'scopus',
        orcid: 'orcid',
        linkedin: 'linkedin',
        moodle: 'moodle',
        iqac_profile: 'iqac',
        iris: 'iris',
        youtube: 'youtube',
        personal_website: 'website',
      };

      for (const [source, target] of Object.entries(profileKeys)) {
        const value = profileJson[source];
        if (typeof value === 'string') socialLinks[target] = value;
      }

      const collaboratedProjects = await prisma.facultyProject.findMany({
        where: {
          otherFaculty: { contains: faculty.name, mode: 'insensitive' },
          NOT: { facultyId: faculty.id },
        },
        include: { faculty: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const ownedProjects = faculty.projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        agency: project.agency,
        role: project.role || 'Principal Investigator',
        amount: project.funding,
        duration: projectDuration(project.startDate, project.endDate),
        startDate: project.startDate?.toISOString().slice(0, 10) || null,
        endDate: project.endDate?.toISOString().slice(0, 10) || null,
        status: !project.endDate || project.endDate >= new Date() ? 'Ongoing' : 'Completed',
        externalLink: sanitizeWebUrl(project.externalLink, false),
        otherFaculty: project.otherFaculty,
        isCoFaculty: false,
      }));

      const coProjects = collaboratedProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        agency: project.agency,
        role: 'Co-Investigator / Collaborator',
        amount: project.funding,
        duration: projectDuration(project.startDate, project.endDate),
        startDate: project.startDate?.toISOString().slice(0, 10) || null,
        endDate: project.endDate?.toISOString().slice(0, 10) || null,
        status: !project.endDate || project.endDate >= new Date() ? 'Ongoing' : 'Completed',
        externalLink: sanitizeWebUrl(project.externalLink, false),
        otherFaculty: `PI: ${project.faculty.name}${project.otherFaculty ? `, ${project.otherFaculty}` : ''}`,
        isCoFaculty: true,
      }));

      person = {
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
        cvUrl: sanitizeWebUrl(faculty.documents?.cv) || null,
        socialLinks,
        customProfiles: Array.isArray(profileJson.other) ? profileJson.other : [],
        type: 'faculty',
        students: faculty.students.map((student) => ({
          id: student.uid,
          name: student.name,
          description: student.description,
          image: student.image || '/faculty.png',
          supervisor: faculty.name,
          topic: student.description || 'Guided Student Project',
          fellowship: 'Research Fellowship',
          joiningYear: student.createdAt.getFullYear(),
          email: faculty.email,
          type: 'scholar',
        })),
        projects: [...ownedProjects, ...coProjects],
        publications: faculty.publications.map((publication) => ({
          id: publication.id,
          title: publication.title,
          journal: publication.journal,
          authors: publication.authors,
          publicationDate: publication.publicationDate?.toISOString().slice(0, 10) || null,
          year: publication.publicationDate?.getFullYear() || null,
          externalLink: sanitizeWebUrl(publication.externalLink, false),
          doi: publication.doi,
          category: publication.category || 'Journal Article',
          description: publication.description,
        })),
      };
    }
  } catch (error) {
    console.error('Failed to fetch faculty profile:', error);
  }

  return <ProfilePageClient person={person} />;
}
