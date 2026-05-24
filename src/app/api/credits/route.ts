import { getCredits } from '@/lib/evolink';
import { requireSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

export async function GET() {
  try {
    const session = await requireSession();
    const { response, data } = await getCredits(session.role === 'USER' ? session.sub : undefined);
    return ok(data, { status: response.status });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return fail('Unauthorized', 401);
    }
    return fail('Gagal mengambil saldo.', 500);
  }
}
