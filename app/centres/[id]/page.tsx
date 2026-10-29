import Link from 'next/link';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import FacultyCard from '@/components/FacultyCard';
import {
  Building2,
  Users,
  ArrowLeft,
  FileText,
  ExternalLink,
} from 'lucide-react';
import type { FacultyMember } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { renderMarkdownText } from '@/lib/markdown';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const centres = await prisma.associatedCentre.findMany({ select: { id: true } });
    return centres.map((centre) => ({ id: centre.id }));
  } catch (error) {
    console.error('Failed to generate centre routes:', error);
    return [];
  }
}

interface FacultyAssociated {
  id: string;
  name: string;
  email?: string;
  designation?: string | null;
  department?: string | null;
  documents?: { image?: string | null } | null;
}

interface CentreDetailData {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  website?: string | null;
  faculties?: FacultyAssociated[];
}

function renderMarkdown(md: string) {
  return renderMarkdownText(md, 'No centre description available yet.');
}

export default async function CentreDetailPage({ params }: PageProps) {
  const { id } = await params;
  let centre: CentreDetailData | null = null;

  try {
    centre = await prisma.associatedCentre.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        website: true,
        faculties: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            department: true,
            documents: { select: { image: true } },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch centre details:', error);
  }

  if (!centre) {
    notFound();
  }

  const faculties = centre.faculties || [];
  const heroImage = centre.image || '/campus.jpg';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Hero
        title={centre.name}
        badge="HOME > ASSOCIATED CENTRES"
        subtitle=""
        bgImage={heroImage}
        align="center"
      />

      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-12 space-y-10">
        {/* Info Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200 text-slate-700 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Type
              </span>
              <span className="text-base sm:text-lg font-bold text-oxford">
                Associated Research Centre
              </span>
            </div>
          </div>

          {centre.website && (
            <a
              href={centre.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-oxford text-white font-semibold text-sm hover:bg-cyan-dark transition-all duration-300 shadow-sm"
            >
              <span>Visit Centre Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Main Content Container */}
        <div className="space-y-12 max-w-5xl">
          {/* Centre Description */}
          <div className="space-y-6 pb-12 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-oxford" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                About the Centre
              </h2>
            </div>

            <div className="text-slate-700 leading-relaxed font-sans">
              {renderMarkdown(centre.description || '')}
            </div>
          </div>

          {/* Faculty In-Charge / Coordinators */}
          {faculties.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-oxford" />
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                    Faculty In-Charge &amp; Coordinators
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-oxford bg-oxford/10 px-3.5 py-1.5 rounded-full">
                  {faculties.length} Coordinator{faculties.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 font-sans">
                {faculties.map((fac) => {
                  const person: FacultyMember = {
                    id: fac.id,
                    name: fac.name,
                    designation: fac.designation || 'Faculty Member',
                    qualification: 'Ph.D.',
                    email: fac.email || '',
                    phone: '',
                    room: '',
                    researchFocus: [],
                    bio: '',
                    publicationsCount: 0,
                    citations: 0,
                    image: fac.documents?.image || '/faculty.png',
                    type: 'faculty',
                  };

                  return (
                    <Link key={fac.id} href={`/people/${fac.id}`} className="block h-full">
                      <FacultyCard person={person} />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Navigation Links */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-sans">
            <Link
              href="/centres"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxford hover:text-cyan-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore all associated centres</span>
            </Link>
            <Link
              href="/people"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:text-cyan-accent transition-colors"
            >
              <span>View all department faculty &amp; scholars</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
