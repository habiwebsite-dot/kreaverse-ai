import json
import re
from pathlib import Path
from typing import Dict, Any
import requests
from bs4 import BeautifulSoup

URLS = {
    'suno-music-generation': 'https://docs.evolink.ai/en/api-manual/audio-series/suno/suno-music-generation',
    'suno-persona-creation': 'https://docs.evolink.ai/en/api-manual/audio-series/suno/suno-persona-creation',
    'qwen-voice-design': 'https://docs.evolink.ai/en/api-manual/audio-series/qwen-tts/qwen-voice-design',
    'qwen3-tts-vd': 'https://docs.evolink.ai/en/api-manual/audio-series/qwen-tts/qwen3-tts-vd',
    'nanobanana-2-beta-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-2-beta-image-generate',
    'nanobanana-pro-beta-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-pro-beta-image-generate',
    'nanobanana-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-image-generate',
    'mj-v7-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/midjourney/mj-v7-image-generate',
    'gpt-4o-image-generation': 'https://docs.evolink.ai/en/api-manual/image-series/gpt-4o/gpt-4o-image-generation',
    'gpt-image-2-beta-image-generation': 'https://docs.evolink.ai/en/api-manual/image-series/gpt-image-2/gpt-image-2-beta-image-generation',
    'seedream-5.0-lite-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/seedream/seedream-5.0-lite-image-generate',
    'wan2.5-image-to-image': 'https://docs.evolink.ai/en/api-manual/image-series/wan2.5/wan2.5-image-to-image',
    'wan2.5-text-to-image': 'https://docs.evolink.ai/en/api-manual/image-series/wan2.5/wan2.5-text-to-image',
    'seedance-2.0-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-text-to-video',
    'seedance-2.0-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-image-to-video',
    'seedance-2.0-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-reference-to-video',
    'happyhorse-1.0-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-text-to-video',
    'happyhorse-1.0-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-image-to-video',
    'happyhorse-1.0-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-reference-to-video',
    'sora-2-preview-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/sora2/sora-2-preview-video-generate',
    'sora-2-pro-preview-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/sora2pro/sora-2-pro-preview-video-generate',
    'veo-3.1-generate-preview-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo-3.1-generate-preview-generate',
    'veo-3.1-fast-generate-preview-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo-3.1-fast-generate-preview-generate',
    'veo3.1-pro-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo3.1-pro-video-generate',
    'wan2.7-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-text-to-video',
    'wan2.7-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-image-to-video',
    'wan2.7-reference-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-reference-video',
    'kling-o3-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-text-to-video',
    'kling-o3-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-image-to-video',
    'kling-o3-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-reference-to-video',
    'kling-v3-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-v3-image-to-video',
    'kling-v3-motion-control': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-v3-motion-control',
    'kling-o1-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o1-image-to-video',
    'grok-imagine-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/grok/grok-imagine-text-to-video',
    'grok-imagine-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/grok/grok-imagine-image-to-video',
    'get-credits': 'https://docs.evolink.ai/en/api-manual/account-management/get-credits',
    'get-task-detail': 'https://docs.evolink.ai/en/api-manual/task-management/get-task-detail',
    'error-codes': 'https://docs.evolink.ai/en/api-manual/task-management/error-codes',
    'upload-base64': 'https://docs.evolink.ai/en/api-manual/file-series/upload-base64',
    'upload-stream': 'https://docs.evolink.ai/en/api-manual/file-series/upload-stream',
    'upload-url': 'https://docs.evolink.ai/en/api-manual/file-series/upload-url',
    'quota': 'https://docs.evolink.ai/en/api-manual/file-series/quota',
}

HEADERS = {"User-Agent": "Mozilla/5.0"}


def parse_fields(soup: BeautifulSoup, prefix: str):
    fields = []
    seen = set()
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith(f'#{prefix}-') and href not in seen:
            seen.add(href)
            container = a.find_parent('div', class_=lambda c: c and 'py-6' in c)
            if not container:
                continue
            text = container.get_text('\n', strip=True)
            chunks = [c.strip() for c in text.split('\n') if c.strip()]
            name = href[len(prefix)+2:]
            name = name.replace('-', '_')
            label = chunks[1] if len(chunks) > 1 else name
            field_type = chunks[2] if len(chunks) > 2 else ''
            desc = ' '.join(chunks[3:12])
            fields.append({
                'anchor': href,
                'name': label,
                'type': field_type,
                'summary': desc[:800],
            })
    return fields


def extract_code_examples(text: str):
    # collect json blocks
    blocks = re.findall(r'```\n(.*?)```', text, flags=re.S)
    request_json = None
    response_json = None
    for block in blocks:
        if '--request' in block:
            m = re.search(r"--data '\n(\{.*?\})\n'", block, flags=re.S)
            if m:
                request_json = m.group(1)
        elif block.strip().startswith('{') and response_json is None:
            response_json = block.strip()
    return request_json, response_json


def endpoint_from_text(text: str):
    m = re.search(r'--url\s+(https://[^\s\\]+)', text)
    return m.group(1) if m else None


def http_method_from_text(text: str):
    m = re.search(r'--request\s+(GET|POST|PUT|DELETE|PATCH)', text)
    return m.group(1) if m else None


def main():
    manifest: Dict[str, Any] = {}
    for key, url in URLS.items():
        html = requests.get(url, headers=HEADERS, timeout=45).text
        soup = BeautifulSoup(html, 'html.parser')
        text = soup.get_text('\n')
        request_json, response_json = extract_code_examples(text)
        entry = {
            'id': key,
            'url': url,
            'title': (soup.title.get_text(strip=True) if soup.title else key),
            'method': http_method_from_text(text),
            'endpoint': endpoint_from_text(text),
            'bodyFields': parse_fields(soup, 'body'),
            'responseFields': parse_fields(soup, 'response'),
            'requestExample': request_json,
            'responseExample': response_json,
        }
        manifest[key] = entry
        print('parsed', key)
    out = Path('src/lib/generated')
    out.mkdir(parents=True, exist_ok=True)
    (out / 'evolink-docs.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')


if __name__ == '__main__':
    main()
