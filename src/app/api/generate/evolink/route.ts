import { createEvolinkTask } from '@/lib/evolink';
import { fail, ok } from '@/lib/http';
import { requireSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (session.role !== 'USER') {
      return fail('Admin tidak menggunakan route generate user.', 403);
    }

    const body = await request.json();
    const { docId, payload } = body as { docId?: string; payload?: Record<string, unknown> };
    if (!docId || !payload || typeof payload !== 'object') {
      return fail('docId dan payload wajib diisi.', 400);
    }

    const { response, data } = await createEvolinkTask({
      docId,
      payload,
      userId: session.sub,
      deviceSession: session.sessionId,
    });

    return ok(data, { status: response.status });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return fail('Login diperlukan untuk generate.', 401, { loginRequired: true });
    }
    if ((error as Error).message === 'NO_API_KEY_AVAILABLE') {
      return fail('Server traffic sedang penuh, silakan masukkan API Key pribadi Anda.', 402, {
        requiresUserKey: true,
      });
    }
    console.error(error);
    return fail('Gagal membuat task Evolink.', 500);
  }
}
