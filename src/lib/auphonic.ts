import { env } from '@/lib/env';

function getAuthHeader() {
  if (env.auphonicApiKey) {
    return { Authorization: `bearer ${env.auphonicApiKey}` };
  }
  if (env.auphonicUsername && env.auphonicPassword) {
    return {
      Authorization: `Basic ${Buffer.from(`${env.auphonicUsername}:${env.auphonicPassword}`).toString('base64')}`,
    };
  }
  throw new Error('AUPHONIC_AUTH_NOT_CONFIGURED');
}

export async function getAuphonicAlgorithms() {
  const response = await fetch(`${env.auphonicBaseUrl}/api/info/algorithms.json`, {
    headers: getAuthHeader(),
    cache: 'no-store',
  });
  const data = await response.json();
  return { response, data };
}

export async function createAuphonicProduction(formFields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(formFields)) {
    if (value !== undefined && value !== '') {
      form.append(key, value);
    }
  }

  const response = await fetch(`${env.auphonicBaseUrl}/api/simple/productions.json`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: form,
    cache: 'no-store',
  });

  const data = await response.json().catch(async () => ({ raw: await response.text() }));
  return { response, data };
}
