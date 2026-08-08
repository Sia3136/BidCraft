const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'C:/Users/Dell/Documents/Siya/BidCraft/images/4b856905f3c2c93617775edd2fc27ead.webp',
      { folder: 'bidcraft_assets' }
    );
    console.log('UPLOAD_SUCCESS:', result.secure_url);
  } catch (err) {
    console.error('UPLOAD_ERROR:', err);
  }
};

uploadImage();
