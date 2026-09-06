import fs from 'fs/promises';
import path from 'path';

async function getSharpPipeline(inputBuffer: Buffer) {
  try {
    const sharpMod = await import('sharp');
    const sharp = sharpMod.default || sharpMod;
    return sharp(inputBuffer, { failOn: 'none' });
  } catch {
    // Fallback for CommonJS runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp');
    return sharp(inputBuffer, { failOn: 'none' });
  }
}

export interface WebpConvertOptions {
  /**
   * WebP compression quality from 1 to 100.
   * Default: 82 (great visual clarity with optimal file size reduction)
   */
  quality?: number;
  /**
   * Optional maximum width. If image is wider, it is downscaled proportionally without enlargement.
   */
  maxWidth?: number;
  /**
   * Optional maximum height. If image is taller, it is downscaled proportionally without enlargement.
   */
  maxHeight?: number;
  /**
   * CPU effort for WebP encoding (0 = fastest, 6 = highest compression).
   * Default: 4
   */
  effort?: number;
  /**
   * Lossless compression mode (for line-art/diagrams if needed).
   * Default: false
   */
  lossless?: boolean;
}

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/tiff',
  'image/bmp',
];

/**
 * Validates if the provided MIME type or filename is an acceptable image format.
 */
export function isAllowedImageType(typeOrFilename: string): boolean {
  if (!typeOrFilename) return false;
  const lower = typeOrFilename.toLowerCase();
  if (ALLOWED_IMAGE_MIME_TYPES.includes(lower)) return true;
  return /\.(jpe?g|png|webp|avif|gif|tiff?|bmp)$/i.test(lower);
}

/**
 * Converts any image (Buffer, ArrayBuffer, or File) into an optimized WebP Buffer.
 */
export async function convertToWebpBuffer(
  input: Buffer | Uint8Array | ArrayBuffer | File,
  options: WebpConvertOptions = {}
): Promise<Buffer> {
  const {
    quality = 82,
    maxWidth,
    maxHeight,
    effort = 4,
    lossless = false,
  } = options;

  let inputBuffer: Buffer;

  if (typeof (input as File)?.arrayBuffer === 'function') {
    const ab = await (input as File).arrayBuffer();
    inputBuffer = Buffer.from(ab);
  } else if (input instanceof ArrayBuffer) {
    inputBuffer = Buffer.from(input);
  } else if (input instanceof Uint8Array || Buffer.isBuffer(input)) {
    inputBuffer = Buffer.from(input);
  } else {
    throw new Error('Unsupported image input type for WebP conversion.');
  }

  let pipeline = (await getSharpPipeline(inputBuffer)).rotate(); // auto-rotate based on EXIF

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return pipeline
    .webp({
      quality,
      effort,
      lossless,
    })
    .toBuffer();
}

/**
 * Converts any uploaded image into WebP format and saves it directly to the target directory.
 *
 * @param input The input image (File, Buffer, or ArrayBuffer)
 * @param targetDir Absolute or relative path to the destination directory (e.g. public/uploads/events)
 * @param filenamePrefix Prefix for the output filename (e.g. 'event_cover', 'faculty_avatar')
 * @param options Optional WebP conversion and resizing options
 * @returns An object containing the web-accessible relative path, absolute path, filename, and size.
 */
export async function saveImageAsWebp(
  input: Buffer | Uint8Array | ArrayBuffer | File,
  targetDir: string,
  filenamePrefix: string,
  options: WebpConvertOptions = {}
): Promise<{
  relativePath: string;
  absolutePath: string;
  fileName: string;
  size: number;
}> {
  // Ensure target directory exists
  const resolvedTargetDir = path.isAbsolute(targetDir)
    ? targetDir
    : path.join(process.cwd(), targetDir);

  await fs.mkdir(resolvedTargetDir, { recursive: true });

  // Convert to WebP buffer
  const webpBuffer = await convertToWebpBuffer(input, options);

  // Generate unique filename with .webp extension
  const timestamp = Date.now();
  const sanitizedPrefix = filenamePrefix.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${sanitizedPrefix}_${timestamp}.webp`;
  const absolutePath = path.join(resolvedTargetDir, fileName);

  // Write file to disk
  await fs.writeFile(absolutePath, webpBuffer);

  // Compute public web-accessible relative path (e.g. /uploads/...)
  const publicDir = path.join(process.cwd(), 'public');
  const rel = path.relative(publicDir, absolutePath).replace(/\\/g, '/');
  const relativePath = rel.startsWith('/') ? rel : `/${rel}`;

  return {
    relativePath,
    absolutePath,
    fileName,
    size: webpBuffer.length,
  };
}
