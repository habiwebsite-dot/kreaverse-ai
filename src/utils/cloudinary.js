const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
async function uploadFile(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'kreaverse-ai', ...options }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}
module.exports = { uploadFile };