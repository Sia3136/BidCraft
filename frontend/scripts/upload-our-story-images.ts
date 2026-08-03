import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa',
  api_key: process.env.CLOUDINARY_API_KEY || '519889658428481',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'aG-lO34ZzE_jW9bFw7b6vSDFP2g',
});

async function uploadAll() {
  const uploads = [
    {
      local: 'C:/Users/Dell/Documents/Siya/BidCraft/images/4b856905f3c2c93617775edd2fc27ead.webp',
      public_id: 'bidcraft/static/pottery-artisan',
    },
    {
      local: 'C:/Users/Dell/Documents/Siya/BidCraft/images/4ee6dbb2e7cc6aee6cf6f2972483f997.jpg',
      public_id: 'bidcraft/static/crochet-craft',
    },
    {
      local: 'C:/Users/Dell/Documents/Siya/BidCraft/images/e966528b52608962bd21f8abdeafbe0a.jpg',
      public_id: 'bidcraft/static/painting-workspace',
    },
  ];

  for (const { local, public_id } of uploads) {
    try {
      const result = await cloudinary.uploader.upload(local, {
        public_id,
        overwrite: false,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });
      console.log(public_id, '->', result.secure_url);
    } catch (e: any) {
      console.error('Upload failed for', public_id, e.message);
    }
  }
}

uploadAll();
