import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_DIR = 'C:/Bidcraft/images';

async function uploadDirectory(dir: string, currentPath: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await uploadDirectory(fullPath, path.join(currentPath, entry.name));
    } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      
      // Construct Cloudinary folder path
      // e.g., "Art/Paintings" -> "bidcraft/art/paintings"
      const folderPath = `bidcraft/${currentPath.replace(/\\/g, '/').toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-')}`;
      
      // Use the filename (without extension) as the public ID
      const publicId = path.parse(entry.name).name;

      try {
        console.log(`Uploading ${entry.name} to folder ${folderPath}...`);
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: folderPath,
          public_id: publicId,
          overwrite: true
        });
        console.log(`✅ Uploaded: ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${fullPath}:`, error);
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(BASE_DIR)) {
    console.error(`Directory not found: ${BASE_DIR}`);
    return;
  }
  
  console.log(`Starting upload from ${BASE_DIR}...`);
  await uploadDirectory(BASE_DIR);
  console.log('Upload complete.');
}

main().catch(console.error);
