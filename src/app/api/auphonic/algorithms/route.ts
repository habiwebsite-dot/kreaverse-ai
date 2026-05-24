import { getAuphonicAlgorithms } from '@/lib/auphonic';
import { requireSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

export async function GET() {
  try {
    await requireSession();
    const { response, data } = await getAuphonicAlgorithms();
    return ok(data, { status: response.status });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') return fail('Unauthorized', 401);
    return fail('Gagal memuat algoritma Auphonic.', 500);
  }
}
