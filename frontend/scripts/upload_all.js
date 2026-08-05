const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const localImages = [
  '/images/crochet-flowers-blue-pot.jpeg',
  '/images/968355308d40d83a2e1f59daa61c5089.jpg',
  '/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg',
  '/images/586fa4c05a4543d441ec3c2bf877f807.jpg',
  '/images/04809f445775b05edf65772b67c139d9.jpg',
  '/images/4256f8dcb8f244ba618721219f550054.jpg',
  '/images/5139a72a8fd930206d06b40689c6e35c.jpg',
  '/images/7f69e85a737d75f85a041d457c9be525.jpg',
  '/images/ed2af0776b49fdea863a1ead90dadf19.jpg',
  '/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg',
  '/images/3599c4c65b94b61ec21a8d070cd401fe.jpg',
  '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg',
  '/images/8891723f370ddd55a88b322a622406a2.jpg',
  '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg',
  '/images/1f92888deb74023c26ec86c954a18188.jpg',
  '/images/5ac5f5ecddd67235241297452010a237.jpg',
  '/images/1da0c6767e60f79b79148794732a305f.jpg',
  '/images/71d0457823cf94b6f1003b8c50253c61.webp'
];

async function uploadAll() {
  const map = {};
  for (const img of localImages) {
    const fullPath = path.join('c:\\Users\\Dell\\Documents\\Siya\\BidCraft\\frontend\\public', img);
    if (!fs.existsSync(fullPath)) {
      console.log('NOT FOUND', fullPath);
      continue;
    }
    try {
      const res = await cloudinary.uploader.upload(fullPath, { folder: "bidcraft_homepage" });
      map[img] = res.secure_url;
      console.log('UPLOADED', img, '->', res.secure_url);
    } catch(e) {
      console.error(e);
    }
  }
  fs.writeFileSync('cloudinary_map.json', JSON.stringify(map, null, 2));
}

uploadAll();
