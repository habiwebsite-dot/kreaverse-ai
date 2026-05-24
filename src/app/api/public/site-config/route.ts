import { ok } from '@/lib/http';
import { readSiteConfig } from '@/lib/site-config';

export async function GET() {
  return ok(readSiteConfig());
}
