const required = [
  'JWT_SECRET',
] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Some features may fail until it is configured.`);
  }
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'kreaverse-dev-secret',
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY || process.env.JWT_SECRET || 'kreaverse-dev-encryption-key-32bytes!!',
  adminEmailHash: process.env.ADMIN_EMAIL_HASH || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  adminTotpSecret: process.env.ADMIN_TOTP_SECRET || '',
  githubToken: process.env.GITHUB_TOKEN || '',
  githubRepo: process.env.GITHUB_REPO || '',
  githubBranch: process.env.GITHUB_BRANCH || 'main',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'kreaverse-ai',
  evolinkApiKeys: (process.env.EVOLINK_API_KEYS || '').split(',').map((item) => item.trim()).filter(Boolean),
  evolinkBaseUrl: process.env.EVOLINK_BASE_URL || 'https://api.evolink.ai',
  evolinkFilesBaseUrl: process.env.EVOLINK_FILES_BASE_URL || 'https://files-api.evolink.ai',
  auphonicBaseUrl: process.env.AUPHONIC_BASE_URL || 'https://auphonic.com',
  auphonicUsername: process.env.AUPHONIC_USERNAME || '',
  auphonicPassword: process.env.AUPHONIC_PASSWORD || '',
  auphonicApiKey: process.env.AUPHONIC_API_KEY || '',
  whatsappNumber: process.env.NEXT_PUBLIC_WA_NUMBER || '6285119821813',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'id',
};
