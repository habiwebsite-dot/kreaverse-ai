const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadFile(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: 'kreaverse-ai',
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

async function uploadFromUrl(url, options = {}) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      resource_type: 'auto',
      folder: 'kreaverse-ai',
      ...options
    });
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function uploadBuffer(buffer, mimetype, originalName, folder = 'uploads') {
  try {
    const resourceType = mimetype.startsWith('audio') ? 'video' :
                         mimetype.startsWith('video') ? 'video' :
                         mimetype.startsWith('image') ? 'image' : 'auto';
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: `kreaverse-ai/${folder}`, use_filename: true },
        (err, res) => { if (err) reject(err); else resolve(res); }
      );
      const r = new Readable();
      r.push(buffer);
      r.push(null);
      r.pipe(stream);
    });
    return { success: true, url: result.secure_url, publicId: result.public_id, resourceType };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function deleteFile(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = { uploadFile, uploadFromUrl, uploadBuffer, deleteFile, cloudinary };