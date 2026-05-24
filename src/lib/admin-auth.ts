import crypto from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL_HASH
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

/**
 * Hash email with SHA256
 */
export function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email).digest('hex')
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  email: string,
  passwordHash: string
): Promise<boolean> {
  const emailHash = hashEmail(email)
  return emailHash === ADMIN_EMAIL && passwordHash === ADMIN_PASSWORD_HASH
}

/**
 * Verify 2FA Token (TOTP)
 */
export function verifyTOTP(token: string, secret: string): boolean {
  // Implementation for TOTP verification
  // You can use 'speakeasy' or 'totp-generator' library
  // For now, returning placeholder
  return true
}
