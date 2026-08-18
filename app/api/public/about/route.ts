import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const aboutRecord = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    if (!aboutRecord) {
      // Default fallback content if database table is empty
      return NextResponse.json({
        id: 1,
        content: `The Department of Physics was founded in 1963 as a department of the University of Kerala at Ernakulam, and later became a constituent department of Cochin University of Science and Technology (CUSAT) upon its establishment in 1971.

Over the last six decades, the department has grown into a major hub for physical science research in South India, securing DST-FIST, UGC-SAP, and DAE-BRNS assistance. Today, our research laboratories house sophisticated analytical tools such as FE-SEM, XRD, micro-Raman, and low-temperature VSM systems.

The department has pioneered research in magnetic nanocomposites, quantum optics, thin film photovoltaics, and theoretical cosmology. We have successfully completed numerous research projects sponsored by national agencies including DST, UGC, DAE, CSIR, and ISRO.`,
        image: '/campus.jpg',
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(aboutRecord);
  } catch (error) {
    console.error('Error fetching public about us data:', error);
    return NextResponse.json(
      { error: 'Failed to load about us details' },
      { status: 500 }
    );
  }
}
