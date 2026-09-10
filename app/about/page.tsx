import AboutPageClient from '@/components/AboutPageClient';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

const DEFAULT_CONTENT = `The Department of Physics was founded in 1963 as a department of the University of Kerala at Ernakulam, and later became a constituent department of Cochin University of Science and Technology (CUSAT) upon its establishment in 1971.

Over the last six decades, the department has grown into a major hub for physical science research in South India, securing DST-FIST, UGC-SAP, and DAE-BRNS assistance. Today, our research laboratories house sophisticated analytical tools such as FE-SEM, XRD, micro-Raman, and low-temperature VSM systems.

The department has pioneered research in magnetic nanocomposites, quantum optics, thin film photovoltaics, and theoretical cosmology. We have successfully completed numerous research projects sponsored by national agencies including DST, UGC, DAE, CSIR, and ISRO.`;

export default async function AboutPage() {
  let aboutData = { content: DEFAULT_CONTENT, image: '/campus.jpg' as string | null };

  try {
    const record = await prisma.aboutUs.findFirst({
      select: { content: true, image: true },
      orderBy: { id: 'asc' },
    });
    if (record) aboutData = record;
  } catch (error) {
    console.error('Failed to fetch About Us content:', error);
  }

  return <AboutPageClient aboutData={aboutData} />;
}
