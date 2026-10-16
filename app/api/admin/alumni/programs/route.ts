import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';
import fs from 'fs/promises';
import path from 'path';

// Helper to save proof documents (PDF or image)
async function saveProofDocument(file: File): Promise<string> {
  const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'alumni', 'proofs');
  await fs.mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const sanitizedName = path.parse(file.name).name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  if (isPdf) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `proof_${timestamp}_${sanitizedName || 'doc'}.pdf`;
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    return `/uploads/alumni/proofs/${fileName}`;
  } else if (isAllowedImageType(file.type || file.name)) {
    const saved = await saveImageAsWebp(file, 'public/uploads/alumni/proofs', 'proof_doc', {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 85,
    });
    return saved.relativePath;
  } else {
    // Other file fallback
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || '.bin';
    const fileName = `proof_${timestamp}_${sanitizedName}${ext}`;
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    return `/uploads/alumni/proofs/${fileName}`;
  }
}

// GET /api/admin/alumni/programs - List all sponsored programs
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const programs = await prisma.alumniSponsoredProgram.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Failed to fetch sponsored programs:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsored programs' }, { status: 500 });
  }
}

// POST /api/admin/alumni/programs - Create a sponsored program
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let programName = '';
    let nature = 'Award';
    let date = '';
    let sponsor: string | null = null;
    let desc = '';
    let photoPath: string | null = null;
    let proofPath: string | null = null;
    let isRecurring = false;
    let sortOrder = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      programName = (formData.get('programName') as string || '').trim();
      nature = (formData.get('nature') as string || 'Award').trim();
      date = (formData.get('date') as string || '').trim();
      sponsor = (formData.get('sponsor') as string || '').trim() || null;
      desc = (formData.get('desc') as string || '').trim();

      const recurringVal = formData.get('isRecurring');
      if (recurringVal !== null) {
        isRecurring = recurringVal === 'true' || recurringVal === '1' || recurringVal === 'on';
      }

      const sortVal = formData.get('sortOrder');
      if (sortVal !== null) {
        sortOrder = parseInt(sortVal as string, 10) || 0;
      }

      // 1. Program display photo
      const photoFile = formData.get('photo') as File | null;
      const photoUrlInput = (formData.get('photoUrl') as string || '').trim();

      if (photoFile && photoFile.size > 0) {
        if (!isAllowedImageType(photoFile.type || photoFile.name)) {
          return NextResponse.json(
            { error: 'Invalid photo format. Supported formats: JPG, PNG, WebP.' },
            { status: 400 }
          );
        }
        const saved = await saveImageAsWebp(photoFile, 'public/uploads/alumni', 'program_photo', {
          maxWidth: 1200,
          maxHeight: 900,
          quality: 85,
        });
        photoPath = saved.relativePath;
      } else if (photoUrlInput) {
        photoPath = photoUrlInput;
      }

      // 2. Upload proof document (PDF or image)
      const proofFile = formData.get('proofFile') as File | null;
      const proofUrlInput = (formData.get('proofUrl') as string || '').trim();

      if (proofFile && proofFile.size > 0) {
        proofPath = await saveProofDocument(proofFile);
      } else if (proofUrlInput) {
        proofPath = proofUrlInput;
      }
    } else {
      const body = await request.json();
      programName = (body.programName || '').trim();
      nature = (body.nature || 'Award').trim();
      date = (body.date || '').trim();
      sponsor = (body.sponsor || '').trim() || null;
      desc = (body.desc || '').trim();
      photoPath = body.photo || null;
      proofPath = body.proofUrl || null;
      if (body.isRecurring !== undefined) isRecurring = Boolean(body.isRecurring);
      if (body.sortOrder !== undefined) sortOrder = parseInt(body.sortOrder, 10) || 0;
    }

    if (!programName) {
      return NextResponse.json({ error: 'Name of the program is required' }, { status: 400 });
    }
    if (!nature) {
      return NextResponse.json({ error: 'Nature of program (Award or Donation) is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    if (!desc) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const created = await prisma.alumniSponsoredProgram.create({
      data: {
        programName,
        nature,
        date,
        sponsor,
        desc,
        photo: photoPath,
        proofUrl: proofPath,
        isRecurring,
        sortOrder,
      },
    });

    revalidatePublicPages();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create sponsored program:', error);
    return NextResponse.json({ error: 'Failed to create sponsored program' }, { status: 500 });
  }
}
