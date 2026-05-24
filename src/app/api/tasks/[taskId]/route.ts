import { getTaskDetail } from '@/lib/evolink';
import { requireSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

export async function GET(_: Request, { params }: { params: { taskId: string } }) {
  try {
    const session = await requireSession();
    const { response, data } = await getTaskDetail(params.taskId, session.role === 'USER' ? session.sub : undefined);
    return ok(data, { status: response.status });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return fail('Unauthorized', 401);
    }
    return fail('Gagal mengambil detail task.', 500);
  }
}
