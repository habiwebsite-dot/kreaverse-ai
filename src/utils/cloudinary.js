/**
 * kreaverse-ai - Cloudinary upload handler
 * By: HABI-STUDIO.AI
 */
const cloudinary = require('cloudinary').v2;

let configured = false;
function init() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

/**
 * Upload buffer / dataURI / remote URL ke Cloudinary
 * @param {Buffer|string} source
 * @param {object} opts { folder, resource_type }
 */
async function uploadAny(source, opts = {}) {
  init();
  const folder = opts.folder || 'kreaverse-ai';
  const resource_type = opts.resource_type || 'auto';

  // Buffer -> data URI
  let payload = source;
  if (Buffer.isBuffer(source)) {
    payload = `data:${opts.mime || 'application/octet-stream'};base64,${source.toString('base64')}`;
  }

  const res = await cloudinary.uploader.upload(payload, {
    folder,
    resource_type,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });
  return {
    url: res.secure_url,
    publicId: res.public_id,
    bytes: res.bytes,
    format: res.format,
    resourceType: res.resource_type,
  };
}

function destroy(publicId, resource_type = 'image') {
  init();
  return cloudinary.uploader.destroy(publicId, { resource_type });
}

module.exports = { uploadAny, destroy };
