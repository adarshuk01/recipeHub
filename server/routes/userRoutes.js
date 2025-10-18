import express from 'express';
import {
  getUserProfile,
  updateProfile,
  toggleFavorite,
  getFavorites,
  toggleFollow,
  getFollowers,
  getFollowing
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createStorage, multer } from '../utils/cloudinary.js';

const upload = multer({ storage: createStorage('RecipeHub_Profile') });

const router = express.Router();

router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/favorite/:recipeId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);
router.put('/:id/follow', protect, toggleFollow);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
