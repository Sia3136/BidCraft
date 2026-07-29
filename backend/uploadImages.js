require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const images = [
  { path: 'C:\\Bidcraft\\images\\a256e2ac9d75854adb286f65a2587887.jpg', name: 'crochet_pouch' },
  { path: 'C:\\Bidcraft\\images\\406e9dec721dd84771f1f68f8c888acf.jpg', name: 'minimal_dog' },
  { path: 'C:\\Bidcraft\\images\\4b856905f3c2c93617775edd2fc27ead.webp', name: 'pottery_artwork' }
];

async function uploadAll() {
  for (const img of images) {
    try {
      const result = await cloudinary.uploader.upload(img.path, {
        folder: 'bidcraft/auth',
        public_id: img.name,
        overwrite: true
      });
      console.log(`[UPLOADED] ${img.name}: ${result.secure_url}`);
    } catch (err) {
      console.error(`[FAILED] ${img.name}:`, err);
    }
  }
}

uploadAll();
