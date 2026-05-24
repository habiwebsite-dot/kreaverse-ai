import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { env } from '@/lib/env';
import { sha256 } from '@/lib/crypto';

export function resolveAdminEmailHash() {
  if (env.adminEmailHash) return env.adminEmailHash;
  if (env.adminEmail) return sha256(env.adminEmail.trim().toLowerCase());
  return '';
}

export async function verifyAdminCredentials(email: string, password: string, otp: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const emailOk = Boolean(resolveAdminEmailHash()) && sha256(normalizedEmail) === resolveAdminEmailHash();
  const passwordOk = env.adminPasswordHash ? await bcrypt.compare(password, env.adminPasswordHash) : false;
  const totpOk = env.adminTotpSecret ? authenticator.verify({ token: otp, secret: env.adminTotpSecret }) : false;
  const whatsappCodeOk = otp === env.adminWhatsappCode;
  return emailOk && passwordOk && (totpOk || whatsappCodeOk);
}