import docs from '@/lib/generated/evolink-docs.json';

export type CatalogGroup = 'audio' | 'image' | 'video' | 'account' | 'task' | 'file';

const featured = {
  image: ['nanobanana-image-generate', 'nanobanana-pro-beta-image-generate', 'gpt-image-2-beta-image-generation', 'wan2.5-image-to-image'],
  audio: ['suno-music-generation', 'suno-persona-creation', 'qwen-voice-design', 'qwen3-tts-vd'],
  video: ['seedance-2.0-image-to-video', 'seedance-2.0-reference-to-video', 'kling-o3-image-to-video', 'wan2.7-image-to-video'],
};

export function getCatalogGroup(endpoint?: string | null): CatalogGroup {
  if (!endpoint) return 'task';
  if (endpoint.includes('/audios/')) return 'audio';
  if (endpoint.includes('/images/')) return 'image';
  if (endpoint.includes('/videos/')) return 'video';
  if (endpoint.includes('/credits')) return 'account';
  if (endpoint.includes('/tasks/')) return 'task';
  return 'file';
}

export const modelCatalog = Object.values(docs).map((item) => ({
  ...item,
  group: getCatalogGroup(item.endpoint),
  isFeatured:
    featured.image.includes(item.id) ||
    featured.audio.includes(item.id) ||
    featured.video.includes(item.id),
}));

export const featuredCatalog = {
  image: modelCatalog.filter((item) => featured.image.includes(item.id)),
  audio: modelCatalog.filter((item) => featured.audio.includes(item.id)),
  video: modelCatalog.filter((item) => featured.video.includes(item.id)),
};
