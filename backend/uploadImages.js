const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const images = [
  'C:\\Users\\Dell\\Documents\\Siya\\BidCraft\\images\\4b856905f3c2c93617775edd2fc27ead.webp',
  'C:\\Users\\Dell\\Documents\\Siya\\BidCraft\\images\\handmade & crafts\\crochet & knitting\\images.jpeg',
  'C:\\Users\\Dell\\Documents\\Siya\\BidCraft\\images\\e966528b52608962bd21f8abdeafbe0a.jpg'
];

async function run() {
  for (const img of images) {
    try {
      const res = await cloudinary.uploader.upload(img, { folder: 'bidcraft_homepage' });
      console.log('UPLOADED:', res.secure_url);
    } catch (e) {
      console.error('FAILED:', img, e.message);
    }
  }
}
run();
