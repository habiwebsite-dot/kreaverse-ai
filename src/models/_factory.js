/**
 * kreaverse-ai - generic adapter factory
 * Setiap adapter spesifik tinggal panggil createAdapter({...}).
 * Dengan ini setiap provider TETAP TERPISAH (model kie hanya di kie, dst).
 */
const { buildClient, safeRequest, pickKey, makeId, saveTask, getTask, updateTask } = require('./_helpers');

function createAdapter(cfg) {
  const {
    id, provider, kind, label,
    baseURL, envKey, modelName,
    paths = {},          // { create, info(taskId) }
    headerStyle = 'bearer', // 'bearer' | 'x-api-key' | 'google' | 'xai'
    buildBody,           // optional custom body builder
    parseTaskId,         // optional extract taskId from response
    parseInfo,           // optional extract state + result from info response
  } = cfg;

  const createPath = paths.create || '/v1/jobs/createTask';
  const infoPath   = paths.info   || ((tid) => `/v1/jobs/recordInfo?taskId=${encodeURIComponent(tid)}`);

  function client(ctx) {
    const key = pickKey(ctx, envKey);
    const headers = {};
    if (headerStyle === 'x-api-key') { headers['x-api-key'] = key; return buildClient(baseURL, null, headers); }
    if (headerStyle === 'google')    { headers['x-goog-api-key'] = key; return buildClient(baseURL, null, headers); }
    if (headerStyle === 'xai')       { headers['Authorization'] = `Bearer ${key}`; return buildClient(baseURL, null, headers); }
    return buildClient(baseURL, key);
  }

  async function createTask(input, ctx) {
    const body = buildBody ? buildBody(input, modelName) : { model: modelName, input, callBackUrl: input.callBackUrl };
    const r = await safeRequest(client(ctx), 'POST', createPath, body);
    const localId = makeId();
    const remoteId = parseTaskId ? parseTaskId(r.data) : (r.data?.taskId || r.data?.id || r.data?.data?.taskId || localId);
    const taskId = remoteId || localId;
    saveTask({
      taskId, provider, model: modelName, kind, label,
      state: r.ok ? 1 : 3, raw: r.data, createdAt: Date.now(),
    });
    return { taskId, state: r.ok ? 1 : 3, provider, model: modelName };
  }

  async function recordInfo(taskId, ctx) {
    const local = getTask(taskId);
    const r = await safeRequest(client(ctx), 'GET', typeof infoPath === 'function' ? infoPath(taskId) : infoPath);
    let patch = {};
    if (parseInfo) patch = parseInfo(r.data) || {};
    else if (r.ok && r.data) {
      const st = r.data.state ?? r.data.status ?? (r.data.resultJson?.resultUrls?.length ? 2 : 1);
      patch = { state: typeof st === 'number' ? st : 1, resultJson: r.data.resultJson || r.data.result || null };
    }
    if (local) updateTask(taskId, patch);
    return getTask(taskId) || { taskId, ...patch, provider, model: modelName };
  }

  return { id, provider, kind, label, modelName, createTask, recordInfo };
}

module.exports = { createAdapter };
