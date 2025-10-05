import express from 'express';
import { getUserProfile, updateProfile, toggleFavorite, getFavorites } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import dotenv from "dotenv";
import multer from 'multer';

dotenv.config(); // must be first

// Configure cloudinary storage for multer
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RecipeHub_Profile',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage });


const router = express.Router();

router.get('/profile/:id', getUserProfile); // public
router.put('/profile', protect,upload.single('avatar'), updateProfile);
router.post('/favorite/:recipeId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
