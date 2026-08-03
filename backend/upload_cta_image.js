require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const localPath = path.join(__dirname, '../frontend/public/images/e966528b52608962bd21f8abdeafbe0a.jpg');

async function uploadImage() {
  try {
    const res = await cloudinary.uploader.upload(localPath, {
      folder: 'bidcraft_homepage',
      public_id: 'craft-livelihood-hero'
    });
    console.log('UPLOAD SUCCESS!');
    console.log('Secure URL:', res.secure_url);
    
    // Create an f_auto,q_auto version
    const parts = res.secure_url.split('/upload/');
    const optimized = parts[0] + '/upload/f_auto,q_auto/' + parts[1];
    console.log('Optimized URL:', optimized);
  } catch (err) {
    console.error('Upload failed:', err);
  }
}

uploadImage();
