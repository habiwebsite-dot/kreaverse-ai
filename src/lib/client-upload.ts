export async function uploadFileToCloudinary(file: File, folder?: string) {
  const signRes = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) {
    const error = await signRes.json().catch(() => ({ error: 'Gagal sign upload' }));
    throw new Error(error.error || 'Gagal sign upload');
  }

  const sign = await signRes.json();
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', sign.timestamp);
  form.append('signature', sign.signature);
  form.append('folder', sign.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload Cloudinary gagal');
  }
  return data as { secure_url: string; original_filename: string };
}
