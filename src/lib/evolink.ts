import { GenerationType } from '@prisma/client';
import docs from '@/lib/generated/evolink-docs.json';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { decryptText } from '@/lib/crypto';
import { getSettings } from '@/lib/site-config';
import { getUserApiKey } from '@/lib/auth';

export type EvolinkDocKey = keyof typeof docs;
export type EvolinkDoc = (typeof docs)[EvolinkDocKey];

type ResolvedKey = {
  id: string;
  label: string;
  value: string;
  source: 'ENV' | 'DB' | 'USER';
};

const RETRYABLE_STATUS = new Set([401, 429, 500, 502, 503, 504]);

export function getEvolinkDocs() {
  return docs;
}

export function getDocEntry(docId: string) {
  const entry = docs[docId as EvolinkDocKey];
  if (!entry) {
    throw new Error(`Unknown docId: ${docId}`);
  }
  return entry;
}

function requireEndpoint(doc: EvolinkDoc) {
  if (!doc.endpoint) {
    throw new Error(`DOC_ENDPOINT_MISSING:${doc.id}`);
  }
  return doc.endpoint;
}

export function detectGenerationType(endpoint: string): GenerationType {
  if (endpoint.includes('/images/')) return GenerationType.IMAGE;
  if (endpoint.includes('/audios/')) return GenerationType.AUDIO;
  if (endpoint.includes('/videos/')) return GenerationType.VIDEO;
  return GenerationType.MASTERING;
}

async function getServerKeys(): Promise<ResolvedKey[]> {
  const dbKeys = await prisma.apiKeyPool.findMany({
    where: { provider: 'evolink', active: true },
    orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
  });

  const resolvedDbKeys = dbKeys.map((item) => ({
    id: item.id,
    label: item.label,
    value: decryptText(item.encryptedKey),
    source: 'DB' as const,
  }));

  const envKeys = env.evolinkApiKeys.map((value, index) => ({
    id: `env-${index + 1}`,
    label: `ENV Key ${index + 1}`,
    value,
    source: 'ENV' as const,
  }));

  return [...resolvedDbKeys, ...envKeys];
}

async function getCandidateKeys(userId?: string) {
  const settings = await getSettings();
  const serverKeys = await getServerKeys();
  const userKey = userId ? await getUserApiKey(userId, 'evolink') : null;

  if (settings.apiKeyMode === 'SERVER_UNLIMITED' && serverKeys.length > 0) {
    return { mode: 'SERVER_UNLIMITED' as const, keys: serverKeys, fallbackUserKey: userKey?.plainKey || null };
  }

  if (userKey?.plainKey) {
    return {
      mode: 'USER_KEY' as const,
      keys: [{ id: userKey.id, label: 'User Key', value: userKey.plainKey, source: 'USER' as const }],
      fallbackUserKey: null,
    };
  }

  if (serverKeys.length > 0) {
    return { mode: 'SERVER_UNLIMITED' as const, keys: serverKeys, fallbackUserKey: null };
  }

  throw new Error('NO_API_KEY_AVAILABLE');
}

async function fetchWithKey(url: string, init: RequestInit, key: ResolvedKey) {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${key.value}`,
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let data: unknown = text;

  try {
    data = JSON.parse(text);
  } catch {
    // keep text
  }

  return { response, data, key };
}

export async function runWithFailover(options: {
  url: string;
  init: RequestInit;
  userId?: string;
}) {
  const { keys, fallbackUserKey } = await getCandidateKeys(options.userId);
  const tried: Array<{ key: string; status: number }> = [];

  for (const key of keys) {
    const result = await fetchWithKey(options.url, options.init, key);

    if (result.response.ok) {
      if (key.source === 'DB') {
        await prisma.apiKeyPool
          .update({
            where: { id: key.id },
            data: { lastUsedAt: new Date() },
          })
          .catch(() => undefined);
      }
      return result;
    }

    tried.push({ key: key.label, status: result.response.status });

    if (key.source === 'DB') {
      await prisma.apiKeyPool
        .update({
          where: { id: key.id },
          data: { failureCount: { increment: 1 }, lastFailureAt: new Date() },
        })
        .catch(() => undefined);
    }

    if (!RETRYABLE_STATUS.has(result.response.status)) {
      return result;
    }
  }

  if (fallbackUserKey) {
    const fallbackResult = await fetchWithKey(options.url, options.init, {
      id: 'fallback-user',
      label: 'Fallback User Key',
      value: fallbackUserKey,
      source: 'USER',
    });
    return fallbackResult;
  }

  const error = new Error('EVOLINK_FAILOVER_EXHAUSTED');
  (error as Error & { tried?: typeof tried }).tried = tried;
  throw error;
}

export async function createEvolinkTask(args: {
  docId: string;
  payload: Record<string, unknown>;
  userId?: string;
  deviceSession?: string;
}) {
  const doc = getDocEntry(args.docId);
  const endpoint = requireEndpoint(doc);

  const result = await runWithFailover({
    url: endpoint,
    init: {
      method: doc.method || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args.payload),
    },
    userId: args.userId,
  });

  const data = result.data as Record<string, any>;

  await prisma.generation
    .create({
      data: {
        userId: args.userId,
        taskId: typeof data?.id === 'string' ? data.id : null,
        provider: 'evolink',
        model: String(args.payload.model || data?.model || args.docId),
        type: detectGenerationType(endpoint),
        status: String(data?.status || (result.response.ok ? 'pending' : 'failed')),
        requestJson: args.payload as any,
        responseJson: (typeof data === 'string' ? { raw: data } : data) as any,
        resultUrls: [],
        deviceSession: args.deviceSession,
      },
    })
    .catch(() => undefined);

  return { response: result.response, data, doc };
}

export async function getCredits(userId?: string) {
  const doc = getDocEntry('get-credits');
  const result = await runWithFailover({
    url: requireEndpoint(doc),
    init: { method: 'GET' },
    userId,
  });

  return { response: result.response, data: result.data };
}

export async function getTaskDetail(taskId: string, userId?: string) {
  const doc = getDocEntry('get-task-detail');
  const url = requireEndpoint(doc).replace('{task_id}', taskId);

  const result = await runWithFailover({
    url,
    init: { method: 'GET' },
    userId,
  });

  const data = result.data as Record<string, any>;

  await prisma.generation
    .updateMany({
      where: { taskId },
      data: {
        status: String(data?.status || 'unknown'),
        responseJson: (typeof data === 'string' ? { raw: data } : data) as any,
        resultUrls: Array.isArray(data?.results)
          ? data.results.filter((item: unknown) => typeof item === 'string')
          : [],
        previewUrl:
          Array.isArray(data?.results) && data.results[0]
            ? String(data.results[0])
            : undefined,
        errorMessage: data?.error?.message
          ? String(data.error.message)
          : undefined,
      },
    })
    .catch(() => undefined);

  return { response: result.response, data };
}

export async function getFileQuota(userId?: string) {
  const doc = getDocEntry('quota');
  const result = await runWithFailover({
    url: requireEndpoint(doc),
    init: { method: 'GET' },
    userId,
  });

  return { response: result.response, data: result.data };
}

export async function uploadFileByUrl(fileUrl: string, userId?: string) {
  const doc = getDocEntry('upload-url');

  const result = await runWithFailover({
    url: requireEndpoint(doc),
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_url: fileUrl }),
    },
    userId,
  });

  return { response: result.response, data: result.data };
}
