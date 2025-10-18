// utils/cloudinary.js
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Reusable storage factory
export const createStorage = (folder, formats = ['jpg', 'png', 'jpeg','webp']) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: formats
    }
  });
};

// Re-export for direct use if needed
export { cloudinary, multer };
