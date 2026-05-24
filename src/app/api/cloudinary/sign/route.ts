import { requireSession } from '@/lib/auth';
import { env } from '@/lib/env';
import { signCloudinarySignature } from '@/lib/crypto';
import { fail, ok } from '@/lib/http';

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json().catch(() => ({}));
    const folder = String(body.folder || env.cloudinaryFolder);
    const timestamp = String(Math.floor(Date.now() / 1000));
    const paramsToSign = { folder, timestamp };
    const signature = signCloudinarySignature(paramsToSign);

    return ok({
      cloudName: env.cloudinaryCloudName,
      apiKey: env.cloudinaryApiKey,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return fail('Unauthorized', 401, { loginRequired: true });
    }
    return fail('Gagal menandatangani upload Cloudinary.', 500);
  }
}
