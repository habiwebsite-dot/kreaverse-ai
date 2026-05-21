/**
 * kreaverse-ai - model registry
 * Setiap model di-grup per provider. Tidak ada percampuran antar provider.
 */
const fs = require('fs');
const path = require('path');

function loadDir(dir) {
  const abs = path.join(__dirname, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter((f) => f.endsWith('.js'))
    .map((f) => require(path.join(abs, f)));
}

const allModels = [
  ...loadDir('image'),
  ...loadDir('video'),
  ...loadDir('audio'),
  ...loadDir('chat'),
];

// Group per provider — DIJAMIN TERPISAH
const byProvider = {};
for (const m of allModels) {
  if (!byProvider[m.provider]) byProvider[m.provider] = [];
  byProvider[m.provider].push({
    id: m.id, label: m.label, kind: m.kind, provider: m.provider, modelName: m.modelName,
  });
}

const byId = Object.fromEntries(allModels.map((m) => [m.id, m]));

function getModel(id) { return byId[id] || null; }
function listProviders() { return byProvider; }
function listAll()      { return allModels.map(({ id, label, kind, provider, modelName }) => ({ id, label, kind, provider, modelName })); }

module.exports = { getModel, listProviders, listAll };
