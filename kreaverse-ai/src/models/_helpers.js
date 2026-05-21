/**
 * kreaverse-ai - shared helpers for model adapters
 * Setiap adapter mengekspor: { id, provider, kind, label, createTask(input, ctx), recordInfo(taskId, ctx) }
 */
const { buildClient, safeRequest } = require('../utils/request');

function pickKey(ctx, envName) {
  // ctx.userKeys[envName] mengizinkan user pakai API key sendiri
  return (ctx && ctx.userKeys && ctx.userKeys[envName]) || process.env[envName] || '';
}

function makeId() {
  return 'kv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// In-memory task store (demo)
const TASKS = new Map();
function saveTask(t) { TASKS.set(t.taskId, t); return t; }
function getTask(id) { return TASKS.get(id); }
function updateTask(id, patch) {
  const t = TASKS.get(id);
  if (!t) return null;
  Object.assign(t, patch);
  TASKS.set(id, t);
  return t;
}

module.exports = { buildClient, safeRequest, pickKey, makeId, saveTask, getTask, updateTask };
