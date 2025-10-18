import express from 'express';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  addComment,
  searchRecipes,
  getRecipesByUser,
  getFollowedUsersRecipes,
  editRecipe,
  getSuggestions
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createStorage, multer } from '../utils/cloudinary.js';

const upload = multer({ 
  storage: createStorage('RecipeHub_recipes', ['jpg', 'png', 'jpeg', 'webp', 'avif']) 
}).fields([
  { name: "mainPhoto", maxCount: 1 },
  { name: "stepImages", maxCount: 100 }
]);

const router = express.Router();

router.put('/:recipeId', protect, upload, editRecipe);
router.get('/feed/my', protect, getFollowedUsersRecipes);
// Suggestion endpoint
router.get('/suggestions', getSuggestions)
router.post('/', protect, upload, createRecipe);
router.get('/', getRecipes);
router.get('/myrecipe/:id', getRecipesByUser);
router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, upload, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

router.post('/:id/like', protect, likeRecipe);
router.post('/:id/comment', protect, addComment);


export default router;
