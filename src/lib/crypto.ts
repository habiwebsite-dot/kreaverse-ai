import crypto from 'crypto';
import { env } from '@/lib/env';

const IV_LENGTH = 16;

function getKey() {
  return crypto.createHash('sha256').update(env.dataEncryptionKey).digest();
}

export function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function encryptText(value: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptText(value: string) {
  const [ivHex, encryptedHex] = value.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', getKey(), Buffer.from(ivHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

export function signCloudinarySignature(params: Record<string, string>) {
  const sorted = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return crypto.createHash('sha1').update(sorted + env.cloudinaryApiSecret).digest('hex');
}
