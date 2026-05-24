import crypto from 'crypto'

/**
 * Generate Device Fingerprint from User Agent + IP
 */
export function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  const combined = `${userAgent}-${ipAddress}`
  return crypto.createHash('sha256').update(combined).digest('hex')
}

/**
 * Generate random device ID for localStorage
 */
export function generateDeviceId(): string {
  return crypto.randomBytes(16).toString('hex')
}
