require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  const imagePath = path.resolve(__dirname, '../../images/4b856905f3c2c93617775edd2fc27ead.webp');
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'bidcraft/editorial',
      public_id: '4b856905f3c2c93617775edd2fc27ead'
    });
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

run();
