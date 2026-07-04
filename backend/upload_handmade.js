require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageDir = path.join(__dirname, '../frontend/public/images');
const filesToUpload = [
  '7f5e7d2df12a023b6511de3c74c586eb.jpg',
  '17f76ad92cbb557f64169f141176e7b1.jpg',
  '7575cad0c34ec572e59b53061ab42d5d.webp',
  'a14b6eac56fde3c0ed4be6117ec5b88b.jpg',
  'a344e75529581e9f43f2c00dc233dea4.webp',
  '5f2ab26c880e06709387b842cdd1feef.webp',
  '3599c4c65b94b61ec21a8d070cd401fe.jpg',
  '04809f445775b05edf65772b67c139d9.jpg',
  '1572725d1d0bf7fa3ab6b92974a3fdfd.jpg',
  '2371958e0daab9fea35be782cfbcb66c.webp',
  'd497bf30fec759fddc8ce0890f380f18.jpg',
  '80a7c1fdd769cc0d35110a438dfb6503.jpg',
  '4472fc60307774b77a3457158adcd98c.webp',
  'crochet-flowers-blue-pot.jpeg',
  'd156289ab52040263f59b16d6f3f5f2c.jpg',
  'f428f0473bba1ebaf8b0bf015d7d4e7b.jpg',
  'crochet-sunflower-pot.jpeg',
  '1bfd66dfc3b8642a56f32f8ed543cc3a.jpg',
  '2d45e55d6a95ae07c38891e3887618a2.jpg',
  '5d25e6472904da283141b4dc037eda2d.webp',
  '90340c0fe5f04ef94056bb544a98ad79.jpg',
  '6825197426036f192e947bf86984bbb3.webp',
  'ce4c6e8df736e34bd96ca50c3c6cfb11.jpg',
  'e0e8112d8f5b16d5612a0e69efbae352.jpg',
  'f41872e1978e36adfa877aff0029dcad.webp'
];

async function uploadImages() {
  for (const filename of filesToUpload) {
    const filePath = path.join(imageDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping missing file: ${filename}`);
      continue;
    }
    try {
      const publicId = filename; 
      await cloudinary.uploader.upload(filePath, { public_id: filename, use_filename: true, unique_filename: false, overwrite: true });
      console.log(`Uploaded: ${filename}`);
    } catch (err) {
      console.error(`Error uploading ${filename}:`, err);
    }
  }
  console.log('Upload complete');
}

uploadImages();
