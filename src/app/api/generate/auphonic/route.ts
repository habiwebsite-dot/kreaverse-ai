import { GenerationType } from '@prisma/client';
import { createAuphonicProduction } from '@/lib/auphonic';
import { fail, ok } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (session.role !== 'USER') {
      return fail('Admin tidak menggunakan mastering user.', 403);
    }

    const body = await request.json();
    const { fields } = body as { fields?: Record<string, string> };
    if (!fields || !fields.input_file) {
      return fail('input_file wajib diisi sebagai URL Cloudinary/HTTP.', 400);
    }

    const { response, data } = await createAuphonicProduction(fields);

    await prisma.generation.create({
      data: {
        userId: session.sub,
        taskId: data?.data?.uuid || data?.uuid || null,
        provider: 'auphonic',
        model: 'auphonic-simple-api',
        type: GenerationType.MASTERING,
        status: response.ok ? 'processing' : 'failed',
        requestJson: fields,
        responseJson: data,
        resultUrls: [],
        deviceSession: session.sessionId,
      },
    }).catch(() => undefined);

    return ok(data, { status: response.status });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return fail('Login diperlukan.', 401);
    }
    console.error(error);
    return fail('Gagal membuat mastering Auphonic.', 500);
  }
}
