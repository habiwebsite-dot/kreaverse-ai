import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { ResultsGrid } from '@/components/results-grid';

export default async function ResultsPage() {
  const session = await getSession();
  const items = session?.role === 'USER'
    ? await prisma.generation.findMany({
        where: { userId: session.sub },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="container py-8">
      <ResultsGrid
        items={items.map((item) => ({
          id: item.id,
          model: item.model,
          type: item.type,
          status: item.status,
          createdAt: item.createdAt.toISOString(),
          previewUrl: item.previewUrl,
          resultUrls: item.resultUrls,
        }))}
      />
    </div>
  );
}
