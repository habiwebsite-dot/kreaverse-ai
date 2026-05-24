import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string,
  resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto'
) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `kreaverse-ai/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    if (typeof file === 'string') {
      stream.end(Buffer.from(file, 'base64'))
    } else {
      stream.end(file)
    }
  })
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

/**
 * Generate signed upload URL for frontend
 */
export function generateCloudinarySignature(timestamp: number, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY

  const string_to_sign = `folder=kreaverse-ai/${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = require('crypto')
    .createHash('sha1')
    .update(string_to_sign)
    .digest('hex')

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
  }
}
