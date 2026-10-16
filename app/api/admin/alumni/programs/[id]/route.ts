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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || '.bin';
    const fileName = `proof_${timestamp}_${sanitizedName}${ext}`;
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    return `/uploads/alumni/proofs/${fileName}`;
  }
}

// PUT /api/admin/alumni/programs/[id] - Update a sponsored program
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.alumniSponsoredProgram.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Sponsored program not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let programName = existing.programName;
    let nature = existing.nature;
    let date = existing.date;
    let sponsor = existing.sponsor;
    let desc = existing.desc;
    let photoPath = existing.photo;
    let proofPath = existing.proofUrl;
    let isRecurring = existing.isRecurring;
    let sortOrder = existing.sortOrder;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('programName')) programName = (formData.get('programName') as string || '').trim();
      if (formData.has('nature')) nature = (formData.get('nature') as string || 'Award').trim();
      if (formData.has('date')) date = (formData.get('date') as string || '').trim();
      if (formData.has('sponsor')) sponsor = (formData.get('sponsor') as string || '').trim() || null;
      if (formData.has('desc')) desc = (formData.get('desc') as string || '').trim();

      if (formData.has('isRecurring')) {
        const recurringVal = formData.get('isRecurring');
        isRecurring = recurringVal === 'true' || recurringVal === '1' || recurringVal === 'on';
      }

      if (formData.has('sortOrder')) {
        const sortVal = formData.get('sortOrder');
        sortOrder = parseInt(sortVal as string, 10) || 0;
      }

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
      } else if (photoUrlInput !== undefined) {
        if (photoUrlInput === '' || photoUrlInput === 'null') {
          photoPath = null;
        } else {
          photoPath = photoUrlInput;
        }
      }

      const proofFile = formData.get('proofFile') as File | null;
      const proofUrlInput = (formData.get('proofUrl') as string || '').trim();

      if (proofFile && proofFile.size > 0) {
        proofPath = await saveProofDocument(proofFile);
      } else if (proofUrlInput !== undefined) {
        if (proofUrlInput === '' || proofUrlInput === 'null') {
          proofPath = null;
        } else {
          proofPath = proofUrlInput;
        }
      }
    } else {
      const body = await request.json();
      if (body.programName !== undefined) programName = (body.programName || '').trim();
      if (body.nature !== undefined) nature = (body.nature || 'Award').trim();
      if (body.date !== undefined) date = (body.date || '').trim();
      if (body.sponsor !== undefined) sponsor = (body.sponsor || '').trim() || null;
      if (body.desc !== undefined) desc = (body.desc || '').trim();
      if (body.photo !== undefined) photoPath = body.photo || null;
      if (body.proofUrl !== undefined) proofPath = body.proofUrl || null;
      if (body.isRecurring !== undefined) isRecurring = Boolean(body.isRecurring);
      if (body.sortOrder !== undefined) sortOrder = parseInt(body.sortOrder, 10) || 0;
    }

    if (!programName) {
      return NextResponse.json({ error: 'Name of the program is required' }, { status: 400 });
    }
    if (!nature) {
      return NextResponse.json({ error: 'Nature of program is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    if (!desc) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const updated = await prisma.alumniSponsoredProgram.update({
      where: { id },
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update sponsored program:', error);
    return NextResponse.json({ error: 'Failed to update sponsored program' }, { status: 500 });
  }
}

// DELETE /api/admin/alumni/programs/[id] - Delete a sponsored program
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.alumniSponsoredProgram.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Sponsored program not found' }, { status: 404 });
    }

    await prisma.alumniSponsoredProgram.delete({
      where: { id },
    });

    revalidatePublicPages();

    return NextResponse.json({ success: true, message: 'Sponsored program deleted successfully' });
  } catch (error) {
    console.error('Failed to delete sponsored program:', error);
    return NextResponse.json({ error: 'Failed to delete sponsored program' }, { status: 500 });
  }
}
