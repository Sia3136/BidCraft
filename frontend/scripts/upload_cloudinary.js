const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imagePath = "c:\\Users\\Dell\\Documents\\Siya\\BidCraft\\images\\art\\sketches & drawings\\4cf20961ee9c8dccc7dfb51c2f561af8.jpg";

cloudinary.uploader.upload(imagePath, { folder: "bidcraft_homepage" })
  .then(result => {
    console.log("UPLOAD_SUCCESS:");
    console.log(result.secure_url);
  })
  .catch(error => {
    console.error("UPLOAD_ERROR:");
    console.error(error);
  });
