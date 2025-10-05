import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  addComment,
  searchRecipes,
  getRecipesByUser
} from '../controllers/recipeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

import dotenv from "dotenv";

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
    folder: 'RecipeHub_recipes',
    allowed_formats: ['jpg', 'png', 'jpeg','webp']
  }
});

const upload = multer({ storage }).fields([
  { name: "mainPhoto", maxCount: 1 },
  { name: "stepImages", maxCount: 100 }, // any number of step images
]);

// Recipe CRUD
router.post('/', protect, upload, createRecipe);
router.get('/', getRecipes);
router.get('/myrecipe/:id', getRecipesByUser);

router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, upload, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

// Social
router.post('/:id/like', protect, likeRecipe);
router.post('/:id/comment', protect, addComment);

// Admin only route example (if needed)
// router.delete('/:id', protect, admin, deleteRecipe);

export default router;
