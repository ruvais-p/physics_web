import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';

function getEncryptionKey() {
  const secret = process.env.SETTINGS_ENCRYPTION_KEY;

  if (!secret || secret.length < 32) {
    throw new Error(
      'SETTINGS_ENCRYPTION_KEY must be configured with at least 32 characters.',
    );
  }

  return createHash('sha256').update(secret).digest();
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    VERSION,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':');
}

export function decryptSecret(value: string) {
  const [version, ivValue, authTagValue, encryptedValue] = value.split(':');

  if (
    version !== VERSION ||
    !ivValue ||
    !authTagValue ||
    !encryptedValue
  ) {
    throw new Error('Stored secret has an invalid format.');
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivValue, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(authTagValue, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}
