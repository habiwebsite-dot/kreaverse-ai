import os
import re
from pathlib import Path
import requests
from bs4 import BeautifulSoup

URLS = {
    'audio/suno-music-generation': 'https://docs.evolink.ai/en/api-manual/audio-series/suno/suno-music-generation',
    'audio/suno-persona-creation': 'https://docs.evolink.ai/en/api-manual/audio-series/suno/suno-persona-creation',
    'audio/qwen-voice-design': 'https://docs.evolink.ai/en/api-manual/audio-series/qwen-tts/qwen-voice-design',
    'audio/qwen3-tts-vd': 'https://docs.evolink.ai/en/api-manual/audio-series/qwen-tts/qwen3-tts-vd',
    'image/nanobanana-2-beta-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-2-beta-image-generate',
    'image/nanobanana-pro-beta-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-pro-beta-image-generate',
    'image/nanobanana-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/nanobanana/nanobanana-image-generate',
    'image/mj-v7-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/midjourney/mj-v7-image-generate',
    'image/gpt-4o-image-generation': 'https://docs.evolink.ai/en/api-manual/image-series/gpt-4o/gpt-4o-image-generation',
    'image/gpt-image-2-beta-image-generation': 'https://docs.evolink.ai/en/api-manual/image-series/gpt-image-2/gpt-image-2-beta-image-generation',
    'image/seedream-5.0-lite-image-generate': 'https://docs.evolink.ai/en/api-manual/image-series/seedream/seedream-5.0-lite-image-generate',
    'image/wan2.5-image-to-image': 'https://docs.evolink.ai/en/api-manual/image-series/wan2.5/wan2.5-image-to-image',
    'image/wan2.5-text-to-image': 'https://docs.evolink.ai/en/api-manual/image-series/wan2.5/wan2.5-text-to-image',
    'video/seedance-2.0-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-text-to-video',
    'video/seedance-2.0-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-image-to-video',
    'video/seedance-2.0-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/seedance2.0/seedance-2.0-reference-to-video',
    'video/happyhorse-1.0-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-text-to-video',
    'video/happyhorse-1.0-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-image-to-video',
    'video/happyhorse-1.0-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/happyhorse1.0/happyhorse-1.0-reference-to-video',
    'video/sora-2-preview-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/sora2/sora-2-preview-video-generate',
    'video/sora-2-pro-preview-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/sora2pro/sora-2-pro-preview-video-generate',
    'video/veo-3.1-generate-preview-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo-3.1-generate-preview-generate',
    'video/veo-3.1-fast-generate-preview-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo-3.1-fast-generate-preview-generate',
    'video/veo3.1-pro-video-generate': 'https://docs.evolink.ai/en/api-manual/video-series/veo3.1/veo3.1-pro-video-generate',
    'video/wan2.7-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-text-to-video',
    'video/wan2.7-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-image-to-video',
    'video/wan2.7-reference-video': 'https://docs.evolink.ai/en/api-manual/video-series/wan2.7/wan2.7-reference-video',
    'video/kling-o3-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-text-to-video',
    'video/kling-o3-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-image-to-video',
    'video/kling-o3-reference-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o3-reference-to-video',
    'video/kling-v3-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-v3-image-to-video',
    'video/kling-v3-motion-control': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-v3-motion-control',
    'video/kling-o1-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/kling/kling-o1-image-to-video',
    'video/grok-imagine-text-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/grok/grok-imagine-text-to-video',
    'video/grok-imagine-image-to-video': 'https://docs.evolink.ai/en/api-manual/video-series/grok/grok-imagine-image-to-video',
    'account/get-credits': 'https://docs.evolink.ai/en/api-manual/account-management/get-credits',
    'task/get-task-detail': 'https://docs.evolink.ai/en/api-manual/task-management/get-task-detail',
    'task/error-codes': 'https://docs.evolink.ai/en/api-manual/task-management/error-codes',
    'file/upload-base64': 'https://docs.evolink.ai/en/api-manual/file-series/upload-base64',
    'file/upload-stream': 'https://docs.evolink.ai/en/api-manual/file-series/upload-stream',
    'file/upload-url': 'https://docs.evolink.ai/en/api-manual/file-series/upload-url',
    'file/quota': 'https://docs.evolink.ai/en/api-manual/file-series/quota',
    'auphonic/simple-api': 'https://auphonic.com/help/api/simple_api.html',
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
}


def clean_text(text: str) -> str:
    lines = [re.sub(r'\s+', ' ', line).strip() for line in text.splitlines()]
    out = []
    prev_blank = False
    for line in lines:
        if not line:
            if not prev_blank:
                out.append('')
            prev_blank = True
        else:
            out.append(line)
            prev_blank = False
    return '\n'.join(out).strip() + '\n'


def html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    for tag in soup(['script', 'style', 'noscript', 'svg']):
        tag.decompose()
    main = soup.find('main') or soup.body or soup
    pieces = []
    for el in main.find_all(['h1','h2','h3','h4','p','li','pre','code','table','tr','td','th']):
        text = el.get_text('\n', strip=True)
        if text:
            pieces.append(text)
    return clean_text('\n\n'.join(pieces))


def main():
    base = Path('docs/official')
    base.mkdir(parents=True, exist_ok=True)
    manifest_lines = ['# Official docs fetched', '']
    for key, url in URLS.items():
        path = base / f'{key}.txt'
        path.parent.mkdir(parents=True, exist_ok=True)
        print('fetching', key)
        resp = requests.get(url, headers=HEADERS, timeout=45)
        resp.raise_for_status()
        text = html_to_text(resp.text)
        path.write_text(text, encoding='utf-8')
        manifest_lines.append(f'- {key}: {url}')
    (base / 'README.md').write_text('\n'.join(manifest_lines) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
