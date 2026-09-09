import fs from 'fs/promises';
import path from 'path';

export function hasPdfSignature(buffer: Buffer) {
  return buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
}

export function resolveUploadedFile(relativeWebPath: string, allowedSubdirectory: string) {
  if (!relativeWebPath.startsWith('/') || relativeWebPath.includes('\0')) return null;

  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(relativeWebPath.split(/[?#]/, 1)[0]);
  } catch {
    return null;
  }

  const uploadsRoot = path.resolve(process.cwd(), 'public', 'uploads');
  const allowedRoot = path.resolve(uploadsRoot, allowedSubdirectory);
  if (allowedRoot !== uploadsRoot && !allowedRoot.startsWith(`${uploadsRoot}${path.sep}`)) return null;

  const candidate = path.resolve(process.cwd(), 'public', `.${decodedPath}`);
  if (candidate !== allowedRoot && !candidate.startsWith(`${allowedRoot}${path.sep}`)) return null;
  return candidate;
}

export async function deleteUploadedFile(
  relativeWebPath: string | null,
  allowedSubdirectory: string
) {
  if (!relativeWebPath) return;
  const filePath = resolveUploadedFile(relativeWebPath, allowedSubdirectory);
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}
