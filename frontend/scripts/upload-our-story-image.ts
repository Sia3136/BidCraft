import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa',
  api_key: process.env.CLOUDINARY_API_KEY || '519889658428481',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'aG-lO34ZzE_jW9bFw7b6vSDFP2g',
});

async function upload() {
  try {
    const result = await cloudinary.uploader.upload(
      'C:/Bidcraft/images/art/sketches & drawings/4cf20961ee9c8dccc7dfb51c2f561af8.jpg',
      {
        folder: 'bidcraft/static',
        public_id: 'our-story-hero',
        overwrite: true,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      }
    );
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

upload();
